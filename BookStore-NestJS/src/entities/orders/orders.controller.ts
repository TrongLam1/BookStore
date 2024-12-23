import { Body, Controller, Get, Param, Post, Put, Query, Req, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRequestDto } from './dto/order-request.dto';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Roles } from '@/decorator/decorator';
import { ADMIN, USER } from '@/role.environment';
import { OrderStatus } from './entities/order.entity';
import { UpdateStatusOrderRequest } from './dto/update-status-order.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('orders')
@UseInterceptors(CacheInterceptor)
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

  @Get('history-orders/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  async getHistoryOrdersFromUser(
    @Request() req: any,
    @Param() userId: number,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string
  ) {
    return await this.ordersService.getHistoryOrdersFromUser(req, +current, +pageSize);
  }

  @Put('update-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async updateOrderStatus(
    @Request() req: any,
    @Body() updateReq: UpdateStatusOrderRequest
  ) {
    return await this.ordersService.updateOrderStatus(req, updateReq.id, updateReq.orderStatus);
  }

  @Put('cancel/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  async cancelOrder(
    @Request() req: any,
    @Param('orderId') orderId: number
  ) {
    return await this.ordersService.updateOrderStatus(req, orderId, OrderStatus.CANCELED);
  }

  @Get('all-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async getAllOrders(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('status') status: OrderStatus
  ) {
    return await this.ordersService.getAllOrders(+current, +pageSize, status);
  }

  @Get('one-order/:codeBill')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  async findOneOrderByCode(@Param("codeBill") codeBill: string) {
    return await this.ordersService.findOrderByCodeBill(codeBill);
  }

  @Get('order-id/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  async findOrderById(@Req() req, @Param("id") id: number) {
    return await this.ordersService.findOrderById(req, id);
  }

  @Get('admin/order-id/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async adminFindOrderById(@Param("id") id: number) {
    return await this.ordersService.adminFindOrderById(id);
  }

  @Get('statistic-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async getStatisticOrders() {
    return await this.ordersService.statisticOrders();
  }

  @Get('amount-by-year/:year')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async getAmountByYear(@Param('year') year: number) {
    return await this.ordersService.getAmountAllMonthsInYear(year);
  }

  @Get('amount-date-range')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async getAmountDateRange(
    @Query('start') start: Date,
    @Query('end') end: Date
  ) {
    return await this.ordersService.getAmountByDayRange(start, end);
  }
}
