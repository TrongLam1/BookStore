import { Public, ResponseMessage } from '@/decorator/decorator';
import { CreateUserDto } from '@/entities/users/dto/create-user.dto';
import { UsersService } from '@/entities/users/users.service';
import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

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
  async login(@Req() req) {
    return await this.authService.signIn(req.user);
  }

  @Get('google/login')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleLogin() { }

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleCallBack(@Req() req, @Res() res) {
    const response = await this.authService.signIn(req.user);
    const string = JSON.stringify(response);
    res.redirect(`http://localhost:3000/auth/login?response=${string}`);
  }

  @Put('reset-password')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Reset password")
  async resetPassword(@Req() req, @Body() body: { oldPass, newPass }) {
    return await this.authService.resetPassword(req.user, body);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Logout")
  async logout(@Req() req) {
    return await this.authService.logout(req.user);
  }
}
