import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRequestDto } from './dto/order-request.dto';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Roles } from '@/decorator/decorator';
import { USER } from '@/role.environment';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post('place-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  async placeOrder(
    @Request() request: any,
    @Body() placeOrderRequest: OrderRequestDto
  ) {
    return await this.ordersService.placeOrder(request, placeOrderRequest);
  }

  @Get('history-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  async getHistoryOrdersFromUser(
    @Request() req: any,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string
  ) {
    return await this.ordersService.getHistoryOrdersFromUser(req, +current, +pageSize);
  }

  @Put('cancel/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  async cancelOrder(
    @Request() req: any,
    @Param('orderId') orderId: number
  ) {
    return await this.ordersService.cancelOrder(req, orderId);
  }
}
