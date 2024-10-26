import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemService } from '../order-item/order-item.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { User } from '../users/entities/user.entity';
import { OrderRequestDto } from './dto/order-request.dto';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { NotificationGateway } from '../notification/notification.gateway';
import { CouponsService } from '../coupons/coupons.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly orderItemService: OrderItemService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly couponService: CouponsService,
    private readonly notificationGateway: NotificationGateway,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) { }

  async placeOrder(req: any, placeOrderRequest: OrderRequestDto) {
    const user = await this.shoppingCartService.getShoppingCartFromUserInternal(req);
    const shoppingCart = user.shoppingCart;
    const cartItems = shoppingCart.cartItems;

    const amountOrder = await this.couponService.checkValidCouponApply(shoppingCart.totalPrices, placeOrderRequest.nameCoupon, user.couponsUsed);

    let newOrder = new Order();
    newOrder.user = user;
    newOrder.address = placeOrderRequest.address;
    newOrder.phone = placeOrderRequest.phone;
    newOrder.username = placeOrderRequest.username;
    newOrder.valueCoupon = placeOrderRequest.valueCoupon;
    newOrder.totalItemsOrder = shoppingCart.totalItems;
    newOrder.totalPriceOrder = amountOrder;
    newOrder.paymentMethod = placeOrderRequest.paymentMethod;
    newOrder.paymentStatus = PaymentStatus.UNPAID;
    newOrder = await this.orderRepository.save(newOrder);

    await this.orderItemService.createNewOrderItems(cartItems, newOrder);
    // await this.shoppingCartService.clearShoppingCart(cartItems, shoppingCart);

    if (placeOrderRequest.nameCoupon !== null) {
      if (user.couponsUsed === null) {
        const arrayCoupons = [placeOrderRequest.nameCoupon];
        user.couponsUsed = arrayCoupons;
        await this.userRepository.save(user);
      } else {
        user.couponsUsed = [...user.couponsUsed, placeOrderRequest.nameCoupon];
        await this.userRepository.save(user);
      }
    }

    this.notificationGateway.sendNewOrderNotification({
      id: newOrder.id,
      createdAt: newOrder.createdAt
    });

    delete newOrder.user;
    return newOrder;
  }

  async findOrderById(req: any, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        user: { id: req.user.userId }
      },
      relations: ['orderItems', 'orderItems.book']
    });

    if (!order) throw new NotFoundException("Not found order");
    return order;
  }

  async adminFindOrderById(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.book']
    });

    if (!order) throw new NotFoundException("Not found order");
    return order;
  }

  async findOrderByCodeBill(codeBill: string) {
    const order = await this.orderRepository.findOne({
      where: { codeBill: codeBill },
      select: ['bankNo', 'updateAt', 'username', 'paymentMethod', 'totalPriceOrder']
    });
    if (!order) throw new NotFoundException("Not found order");
    return order;
  }

  async getHistoryOrdersFromUser(req: any, current: number, pageSize: number) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const user = await this.userRepository.findOneBy({ id: req.user.userId });
    const [listOrders, totalItems] = await this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.book', 'book')
      .select([
        'order.id',
        'order.createdAt',
        'order.address',
        'order.username',
        'order.phone',
        'order.paymentMethod',
        'order.orderStatus',
        'order.totalItemsOrder',
        'order.totalPriceOrder',
        'orderItem.id',
        'orderItem.quantity',
        'orderItem.totalPrice',
        'book.id',
        'book.name',
        'book.imageUrl'
      ])
      .where('order.userId = :userId', { userId: user.id })
      .orderBy('order.createdAt', 'DESC')
      .skip((current - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { listOrders, totalItems, totalPages: Math.ceil(totalItems / pageSize) };
  };

  async updateOrderStatus(req: any, orderId: number, orderStatus: OrderStatus) {
    const order = await this.orderRepository.findOneBy({ id: orderId });

    if (orderStatus === OrderStatus.CANCELED &&
      (order.orderStatus === OrderStatus.SHIPPING || order.orderStatus === OrderStatus.COMPLETED)) {
      throw new BadRequestException("Không thể hủy đơn hàng.");
    }

    return await this.orderRepository.save({ ...order, orderStatus: orderStatus });
  };

  async updateOrderPayment(order: Order, paymentStatus: PaymentStatus, codeBill: string) {
    return await this.orderRepository.save({
      ...order, paymentStatus, codeBill
    });
  }

  async getAllOrders(current: number, pageSize: number, status: OrderStatus) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    if (status) {
      queryBuilder.where('order.orderStatus = :status', { status });
    }

    const [listOrders, totalItems] = await queryBuilder
      .orderBy('order.id', 'DESC')
      .take(pageSize)
      .skip((current - 1) * pageSize)
      .select(['order.id', 'order.createdAt', 'order.username', 'order.orderStatus', 'order.totalPriceOrder'])
      .getManyAndCount();

    return { listOrders, totalItems, totalPages: Math.ceil(totalItems / pageSize) };
  }

  async statisticOrders() {
    const totalCancelOrders = await this.orderRepository.count({
      where: { orderStatus: OrderStatus.CANCELED }
    });

    const totalPendingOrders = await this.orderRepository.count({
      where: { orderStatus: OrderStatus.PENDING }
    });

    const totalShippingOrders = await this.orderRepository.count({
      where: { orderStatus: OrderStatus.SHIPPING }
    });

    const totalCompletedOrders = await this.orderRepository.count({
      where: { orderStatus: OrderStatus.COMPLETED }
    });

    const sum = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalPriceOrder)', 'total')
      .where('order.orderStatus = :status', { status: OrderStatus.COMPLETED })
      .getRawOne();

    return {
      cancelOrders: totalCancelOrders,
      pendingOrders: totalPendingOrders,
      shippingOrders: totalShippingOrders,
      completedOrders: totalCompletedOrders,
      revenue: sum.total || 0
    }
  }

  async getAmountAllMonthsInYear(year: number) {
    const result = await this.orderRepository.createQueryBuilder('order')
      .select('MONTH(order.createdAt)', 'month')  // MySQL MONTH() function
      .addSelect('SUM(order.totalPriceOrder)', 'total')  // Sum of total prices
      .where('YEAR(order.createdAt) = :year', { year })  // MySQL YEAR() function
      .andWhere('order.orderStatus = :status', { status: OrderStatus.COMPLETED })  // Filter by status
      .groupBy('MONTH(order.createdAt)')  // Group by month
      .orderBy('MONTH(order.createdAt)', 'ASC')  // Order by month
      .getRawMany();  // Retrieve the raw result

    return result;
  }

  async getAmountByDayRange(start: Date, end: Date) {
    const result = await this.orderRepository.createQueryBuilder('order')
      .select("DATE_FORMAT(order.createdAt, '%Y-%m-%d')", 'date')  // Format date to 'YYYY-MM-DD'
      .addSelect('SUM(order.totalPriceOrder)', 'total')  // Sum total prices
      .where('order.createdAt BETWEEN :start AND :end', { start, end })  // Date range filter
      .andWhere('order.orderStatus = :status', { status: OrderStatus.COMPLETED })  // Filter by status
      .groupBy("DATE_FORMAT(order.createdAt, '%Y-%m-%d')")  // Group by date
      .orderBy('order.createdAt', 'ASC')  // Order by created date
      .getRawMany();  // Get raw results

    return result;
  }
}
