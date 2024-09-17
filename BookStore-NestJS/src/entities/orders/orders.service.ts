import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemService } from '../order-item/order-item.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { User } from '../users/entities/user.entity';
import { OrderRequestDto } from './dto/order-request.dto';
import { Order, OrderStatus } from './entities/order.entity';

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
    // newOrder.paymentStatus =
    newOrder = await this.orderRepository.save(newOrder);

    await this.orderItemService.createNewOrderItems(cartItems, newOrder);
    await this.shoppingCartService.clearShoppingCart(cartItems, shoppingCart);

    delete newOrder.user;
    return newOrder;
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

  async cancelOrder(req: any, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        user: { id: req.user.userId }
      },
    });
    if (!order) throw new NotFoundException("Not found order");

    return await this.orderRepository.save({ ...order, orderStatus: OrderStatus.CANCELED });
  };
}
