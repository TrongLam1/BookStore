import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { NotEnoughBookException } from '../books/exception/CustomizeExceptionBook';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemService {
    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        private readonly bookService: BooksService
    ) { }

    async createNewOrderItems(items: CartItem[], order: Order) {
        const booksUpdate = [];

        const orderItems = items.map(item => {
            const book = item.book;
            book.inventory -= item.quantity;

            if (book.inventory < 0) throw new NotEnoughBookException();

            booksUpdate.push(book);

            const orderItem = new OrderItem();
            orderItem.currentPrice = item.book.currentPrice;
            orderItem.book = item.book;
            orderItem.order = order;
            orderItem.totalPrice = item.totalPrice;
            orderItem.quantity = item.quantity;

            return orderItem;
        });
        await this.orderItemRepository.save(orderItems);
        await this.bookService.updateListBooks(booksUpdate);
    }
}
