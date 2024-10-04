import { Controller, Get, Post, Req } from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { Public } from '@/decorator/decorator';

@Controller('vnpay')
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) { }

  @Post()
  @Public()
  createPaymentUrl(@Req() req) {
    return this.vnpayService.createPaymentUrl(req);
  }

  @Get('confirm-payment')
  @Public()
  getVnPayReturn(@Req() req) {
    return this.vnpayService.getVnPayReturn(req);
  }
}
