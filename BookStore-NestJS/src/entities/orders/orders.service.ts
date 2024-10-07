import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemService } from '../order-item/order-item.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { User } from '../users/entities/user.entity';
import { OrderRequestDto } from './dto/order-request.dto';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly orderItemService: OrderItemService,
    private readonly shoppingCartService: ShoppingCartService
  ) { }

  async placeOrder(req: any, placeOrderRequest: OrderRequestDto) {
    const user = await this.shoppingCartService.getShoppingCartFromUserInternal(req);
    const shoppingCart = user.shoppingCart;
    const cartItems = shoppingCart.cartItems;

    let newOrder = new Order();
    newOrder.user = user;
    newOrder.address = placeOrderRequest.address;
    newOrder.phone = placeOrderRequest.phone;
    newOrder.username = placeOrderRequest.username;
    newOrder.valueCoupon = placeOrderRequest.valueCoupon;
    newOrder.totalItemsOrder = shoppingCart.totalItems;
    newOrder.totalPriceOrder = shoppingCart.totalPrices;
    newOrder.paymentMethod = placeOrderRequest.paymentMethod;
    newOrder.paymentStatus = PaymentStatus.UNPAID;
    newOrder = await this.orderRepository.save(newOrder);

    await this.orderItemService.createNewOrderItems(cartItems, newOrder);
    await this.shoppingCartService.clearShoppingCart(cartItems, shoppingCart);

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
    const order = await this.findOrderById(req, orderId);

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

  async getAllOrders(current: number, pageSize: number) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const [listOrders, totalItems] = await this.orderRepository.findAndCount(
      {
        take: pageSize,
        skip: (current - 1) * pageSize,
        select: ['id', 'createdAt', 'username', 'orderStatus', 'totalPriceOrder']
      }
    );

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
}
