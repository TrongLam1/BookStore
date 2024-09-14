import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandDto } from './dto/brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createBrand(@Body() createBrandDto: BrandDto) {
    return this.brandService.createNewBrand(createBrandDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateBrand(@Body() updateBrandDto: BrandDto) {
    return this.brandService.updateBrand(updateBrandDto);
  }

  @Get()
  @Public()
  findAllBrands(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('sort') sort: string
  ) {
    return this.brandService.findAllBrands(+current, +pageSize, sort);
  }
}
