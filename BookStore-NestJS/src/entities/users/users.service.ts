import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPasswordHelper } from 'src/helpers/utils';

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
    const user = await this.usersRepository.save({
      username, email, password: hashPassword,
      isActive: false
    });

    return { id: user.id };
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    return user;
  }

  async generateRefreshToken(user: User, refreshToken: string) {
    user = await this.usersRepository.save({
      ...user,
      refreshToken: refreshToken
    });
    return user.refreshToken;
  }
}
