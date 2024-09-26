import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { ADMIN } from '@/role.environment';
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
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
  async createType(@Body() createTypeDto: TypeDto) {
    return await this.typeService.createNewType(createTypeDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async updateType(@Body() updateTypeDto: TypeDto) {
    return await this.typeService.updateType(updateTypeDto);
  }

  @Get('all')
  @Public()
  async findAllTypes() {
    return await this.typeService.findAllTypesName();
  }
}
