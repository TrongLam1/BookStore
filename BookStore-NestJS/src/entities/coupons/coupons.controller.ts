import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { ADMIN } from '@/role.environment';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('coupons')
@UseInterceptors(CacheInterceptor)
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponsService.createNewCoupon(createCouponDto);
  }

  @Get('/:current')
  @Public()
  async getCoupons(@Param('current') current: number) {
    return await this.couponsService.findAllCoupons(current);
  }

  @Get('coupon-valid/:current')
  @Public()
  async getCouponsValid(@Param('current') current: number) {
    return await this.couponsService.findAllCouponsValid(current);
  }

  @Get('id/:id')
  @Public()
  async getOneCoupon(@Param('id') id: number) {
    return await this.couponsService.getOneCoupon(id);
  }

  @Get('name/:name')
  @Public()
  async getOneCouponByName(@Param('name') name: string) {
    return await this.couponsService.findCouponByName(name);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async updateCoupon(@Body() updateCouponDto: UpdateCouponDto) {
    return await this.couponsService.updateCoupon(updateCouponDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async removeCoupon(@Param('id') id: number) {
    return await this.couponsService.removeCoupon(id);
  }
}
