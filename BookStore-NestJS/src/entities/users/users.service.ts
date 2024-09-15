import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPasswordHelper } from 'src/helpers/utils';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const selectField: any = ['id', 'username', 'email', 'phone', 'createdAt', 'updateAt', 'isActive'];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  isEmailExist = async (email: string) => {
    const existEmail = await this.usersRepository.findOneBy({ email });
    if (existEmail) return true;
    return false;
  }

  async register(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const checkEmail = await this.isEmailExist(email);
    if (checkEmail) throw new BadRequestException(`Email ${email} đã được sử dụng.`);

    const hashPassword = await hashPasswordHelper(password);
    return await this.usersRepository.save({
      username, email, password: hashPassword,
      isActive: false
    });
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

  async generateRefreshToken(user: User, refreshToken: string) {
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
    if (updateUserDTO.password) {
      newPassword = await hashPasswordHelper(updateUserDTO?.password);
    }

    user = {
      ...user,
      username: updateUserDTO.username ? updateUserDTO.username : user.username,
      phone: updateUserDTO.phone ? updateUserDTO.phone : user.phone,
      password: updateUserDTO.password ? newPassword : user.password
    };

    user = await this.usersRepository.save(user);

    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      email: user.email
    };
  }
}
