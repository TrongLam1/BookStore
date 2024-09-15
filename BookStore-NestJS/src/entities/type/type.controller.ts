import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { ADMIN } from '@/role.environment';
import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TypeDto } from './dto/type.dto';
import { TypeService } from './type.service';

@Controller('type')
export class TypeController {

  constructor(
    private readonly typeService: TypeService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  createType(@Body() createTypeDto: TypeDto) {
    return this.typeService.createNewType(createTypeDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  updateType(@Body() updateTypeDto: TypeDto) {
    return this.typeService.updateType(updateTypeDto);
  }

  @Get()
  @Public()
  findAllTypes(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('sort') sort: string
  ) {
    return this.typeService.findAllTypes(+current, +pageSize, sort);
  }
}
