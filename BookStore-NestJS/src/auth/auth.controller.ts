import { Public, ResponseMessage } from '@/decorator/decorator';
import { CreateUserDto } from '@/entities/users/dto/create-user.dto';
import { UsersService } from '@/entities/users/users.service';
import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
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
  @ResponseMessage("Register account")
  @Public()
  async register(@Body() registerDTO: CreateUserDto) {
    return await this.userService.register(registerDTO);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  @ResponseMessage("Fetch login")
  async login(@Request() req) {
    return await this.authService.signIn(req.user);
  }

  @Put('reset-password')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Reset password")
  async resetPassword(@Request() req, @Body() password: any) {
    return await this.authService.resetPassword(req.user, password);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Logout")
  async logout(@Request() req) {
    return await this.authService.logout(req.user);
  }
}
