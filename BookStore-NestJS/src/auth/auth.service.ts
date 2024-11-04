import { CreateUserDto } from '@/entities/users/dto/create-user.dto';
import { User } from '@/entities/users/entities/user.entity';
import { UsersService } from '@/entities/users/users.service';
import { comparePasswordHelper } from '@/helpers/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;

    const validPassword = await comparePasswordHelper(password, user.password);
    if (!validPassword) return null;

    return user;
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(googleUser.email);
    if (user) return user;
    return await this.usersService.register(googleUser);
  }

  async signIn(user: User): Promise<any> {
    const roles = user.roles.map(role => role.name);
    const payload = {
      id: user.id, email: user.email,
      phone: user.phone, address: user.address, roles
    };
    const refreshToken = this.jwtService.sign(payload,
      {
        secret: process.env.REFRESH_JWT_SECRET_KEY,
        expiresIn: '30d'
      })
    await this.usersService.saveRefreshToken(user, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        address: user.address,
        roles
      },
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refreshToken
    };
  }

  async resetPassword(req, body: any) {
    const user = await this.usersService.findOneByEmail(req.email);
    if (!user) return null;

    const checkPassword = await comparePasswordHelper(body.oldPass, user.password);
    if (!checkPassword) throw new BadRequestException("Mật khẩu không đúng.");

    const checkDuplicatePassword = await comparePasswordHelper(body.newPass, user.password);
    if (checkDuplicatePassword) throw new BadRequestException("Mật khẩu mới phải khác mật khẩu cũ.");

    return await this.usersService.resetPassword(user, body.newPass);
  }

  async logout(user: User) {
    return await this.usersService.logout(user);
  }
}
