import { Public } from '@/decorator/decorator';
import { CreateUserDto } from '@/entities/users/dto/create-user.dto';
import { UsersService } from '@/entities/users/users.service';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) { }

  @Post('register')
  @Public()
  async register(@Body() registerDTO: CreateUserDto) {
    return await this.userService.register(registerDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    return await this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req) {
    return await this.authService.logout(req.user);
  }
}
