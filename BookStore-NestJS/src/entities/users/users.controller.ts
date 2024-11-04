import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { Body, Controller, Get, Param, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ADMIN } from '@/role.environment';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.register(createUserDto);
  }

  @Get('active')
  @Public()
  async activeAccount(
    @Query('email') email: string,
    @Query('code') code: number
  ) {
    return await this.usersService.activeAccount(email, code);
  }

  @Get('reactive')
  @Public()
  async reactiveCode(@Query('email') email: string) {
    return await this.usersService.reactiveCode(email);
  }

  @Get('find/email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async findByEmail(@Param('email') email: string) {
    return await this.usersService.findOneByEmail(email);
  }

  @Get('profile/:userId')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any, @Param('userId') userId: number) {
    return this.usersService.getProfile(req);
  }

  @Get('find/all-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async findAllUsers(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('sort') sort: string
  ) {
    return this.usersService.findAllUsers(+current, +pageSize, sort);
  }

  @Get('find/username')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async findUsersByUsername(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('sort') sort: string,
    @Query('username') username: string) {
    return this.usersService.findUsersByNameContains(+current, +pageSize, sort, username);
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Request() req: any,
    @Body() updateUserDTO: UpdateUserDto) {
    return this.usersService.updateUser(req, updateUserDTO);
  }
}
