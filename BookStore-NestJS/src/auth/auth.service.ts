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
    const validPassword = await comparePasswordHelper(password, user.password);

    if (!user || !validPassword) return null;

    return user;
  }

  async signIn(user: User): Promise<any> {
    const payload = { username: user.email, id: user.id, roles: user.roles.map(role => role.name), hasRefreshToken: true };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' })
    await this.usersService.generateRefreshToken(user, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refreshToken
    };
  }
}
