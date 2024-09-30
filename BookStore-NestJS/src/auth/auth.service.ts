import { User } from '@/entities/users/entities/user.entity';
import { UsersService } from '@/entities/users/users.service';
import { comparePasswordHelper } from '@/helpers/utils';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;

    const validPassword = await comparePasswordHelper(password, user.password);
    if (!validPassword) return null;

    return user;
  }

  async signIn(user: User): Promise<any> {
    const roles = user.roles.map(role => role.name);
    const payload = { username: user.email, id: user.id, roles, hasRefreshToken: true };
    const refreshToken = this.jwtService.sign(payload,
      {
        secret: process.env.REFRESH_JWT_SECRET_KEY,
        expiresIn: '30d'
      })
    await this.usersService.generateRefreshToken(user, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        roles
      },
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refreshToken
    };
  }

  async logout(user: User) {
    return await this.usersService.logout(user);
  }
}
