import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { ADMIN } from '@/role.environment';
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandDto } from './dto/brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async createBrand(@Body() createBrandDto: BrandDto) {
    return await this.brandService.createNewBrand(createBrandDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async updateBrand(@Body() updateBrandDto: BrandDto) {
    return await this.brandService.updateBrand(updateBrandDto);
  }

  @Get('all')
  @Public()
  async findAllBrands() {
    return await this.brandService.findAllBrands();
  }
}
