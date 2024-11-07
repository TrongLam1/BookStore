import { clearCacheWithPrefix } from '@/redis/redisOptions';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPasswordHelper } from 'src/helpers/utils';
import { MailService } from 'src/mail/mail.service';
import { USER } from 'src/role.environment';
import { Like, Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const selectField: any = ['id', 'username', 'email', 'phone', 'address', 'createdAt', 'updateAt', 'isActive'];
const prefix = '/api/v1/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) { }

  private isEmailExist = async (email: string) => {
    const existEmail = await this.usersRepository.findOneBy({ email });
    if (existEmail) return true;
    return false;
  }

  async register(createUserDto: CreateUserDto) {
    const { username, email, password, provider } = createUserDto;

    const checkEmail = await this.isEmailExist(email);
    if (checkEmail) throw new BadRequestException(`Email ${email} đã được sử dụng.`);

    const roleUser = await this.roleService.findRoleByName(USER);
    const hashPassword = await hashPasswordHelper(password);

    let user;

    if (provider !== null) {
      user = await this.usersRepository.save({
        username, email, password: hashPassword,
        provider, isActive: true, roles: [roleUser]
      });
    } else {
      const code = Math.floor(Math.random() * 899999 + 100000);

      const codeExpired = new Date();
      codeExpired.setMinutes(codeExpired.getMinutes() + 5);

      user = await this.usersRepository.save({
        username, email, password: hashPassword,
        code, codeExpired, isActive: false, roles: [roleUser]
      });

      this.mailService.mailActivationAccount(user);
    }

    await clearCacheWithPrefix(this.cacheManager, prefix);

    return {
      id: user.id, email: user.email, username: user.username,
      roles: user.roles, address: user.address
    };
  }

  async activeAccount(email: string, code: number) {
    const user = await this.usersRepository.findOneBy({ email });
    if (user.provider !== null) return "Active account successfully.";

    const now = new Date();
    if (user.code !== +code) throw new BadRequestException("Mã kích hoạt không đúng.");
    if (user.codeExpired < now) throw new BadRequestException("Mã kích hoạt đã hết hạn.");

    await this.usersRepository.save({ ...user, code: null, codeExpired: null, isActive: true });

    return "Active account successfully.";
  }

  async reactiveCode(email: string) {
    let user = await this.usersRepository.findOneBy({ email });

    if (!user) throw new NotFoundException("Không tìm thấy thông tin tài khoản.");

    if (user.provider !== null) return;

    const code = Math.floor(Math.random() * 899999 + 100000);
    const codeExpired = new Date();
    codeExpired.setMinutes(codeExpired.getMinutes() + 5);

    user = await this.usersRepository.save({ ...user, code, codeExpired });

    this.mailService.mailActivationAccount(user);

    return "Send code active.";
  }

  async resetPassword(user: User, newPassword: string) {
    if (user.provider !== null) return `Tài khoản ${user.provider} không thể đổi mật khẩu.`;

    const newPasswordHash = await hashPasswordHelper(newPassword);
    await this.usersRepository.save({ ...user, password: newPasswordHash });

    return "Reset password successfully.";
  }

  async logout(user: User) {
    user = await this.usersRepository.save({
      ...user, refreshToken: null
    });
    return { id: user.id, username: user.username, refreshToken: user.refreshToken };
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async getProfile(req: any) {
    return await this.usersRepository.find(
      {
        where: { id: req.user.userId },
        select: selectField
      }
    );
  }

  async saveRefreshToken(user: User, refreshToken: string) {
    user = await this.usersRepository.save({
      ...user,
      refreshToken: refreshToken
    });
    return user.refreshToken;
  }

  async findAllUsers(current: number, pageSize: number, sort: string) {

    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const [result, totalItems] = await this.usersRepository.findAndCount(
      {
        order: { id: sortOrder },
        take: pageSize,
        skip: (current - 1) * pageSize,
        select: selectField
      }
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return { result, totalItems, totalPages };
  }

  async findUsersByNameContains(current: number, pageSize: number, sort: string, name: string) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const [result, totalItems] = await this.usersRepository.findAndCount(
      {
        where: { username: Like('%' + name + '%') },
        order: { username: sortOrder },
        take: pageSize,
        skip: (current - 1) * pageSize
      }
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return { result, totalItems, totalPages };
  }

  async updateUser(req: any, updateUserDTO: UpdateUserDto) {
    let user = await this.usersRepository.findOneBy({ id: req.user.userId });
    if (!user) { throw new NotFoundException("Not found user") };

    let newPassword = null;
    if (updateUserDTO.password && user.provider === null) {
      newPassword = await hashPasswordHelper(updateUserDTO?.password);
    }

    user = {
      ...user,
      username: updateUserDTO.username ? updateUserDTO.username : user.username,
      phone: updateUserDTO.phone ? updateUserDTO.phone : user.phone,
      password: updateUserDTO.password && user.provider === null ? newPassword : user.password
    };

    user = await this.usersRepository.save(user);
    await clearCacheWithPrefix(this.cacheManager, prefix);

    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      email: user.email
    };
  }
}
