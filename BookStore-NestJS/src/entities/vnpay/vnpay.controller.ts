import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { USER } from '@/role.environment';
import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { VnpayService } from './vnpay.service';

@Controller('vnpay')
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) { }

  @Post(':orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  createPaymentUrl(@Req() req, @Param('orderId') orderId: number) {
    return this.vnpayService.createPaymentUrl(req, orderId);
  }

  @Get('confirm-payment')
  @Public()
  getVnPayReturn(@Req() req, @Res() res) {
    return this.vnpayService.getVnPayReturn(req, res);
  }
}
