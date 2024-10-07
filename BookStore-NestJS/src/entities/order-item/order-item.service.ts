import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { NotEnoughBookException } from '../books/exception/CustomizeExceptionBook';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class OrderItemService {
    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        private readonly bookService: BooksService,
        private readonly entityManager: EntityManager
    ) { }

    async createNewOrderItems(items: CartItem[], order: Order) {
        // const booksUpdate = [];

        // const orderItems = items.map(item => {
        //     const book = item.book;
        //     book.inventory -= item.quantity;
        //     book.sold += item.quantity;

        //     if (book.inventory < 0) throw new NotEnoughBookException();

        //     booksUpdate.push(book);

        //     const orderItem = new OrderItem();
        //     orderItem.currentPrice = item.book.currentPrice;
        //     orderItem.book = item.book;
        //     orderItem.order = order;
        //     orderItem.totalPrice = item.totalPrice;
        //     orderItem.quantity = item.quantity;

        //     return orderItem;
        // });
        // await this.orderItemRepository.save(orderItems);
        // await this.bookService.updateListBooks(booksUpdate);

        const queryRunner: QueryRunner = this.entityManager.connection.createQueryRunner();

        // Start the transaction
        await queryRunner.startTransaction();

        try {
            const booksUpdate = [];
            const orderItems = [];

            for (const item of items) {
                const book = await queryRunner.manager.findOne(Book, {
                    where: { id: item.book.id },
                    lock: { mode: 'pessimistic_write' }, // Lock the book row for this transaction
                });

                if (book.inventory < item.quantity) {
                    throw new NotEnoughBookException();
                }

                // Update book stock and sold count
                book.inventory -= item.quantity;
                book.sold += item.quantity;

                booksUpdate.push(book);

                const orderItem = new OrderItem();
                orderItem.currentPrice = item.book.currentPrice;
                orderItem.book = item.book;
                orderItem.order = order;
                orderItem.totalPrice = item.totalPrice;
                orderItem.quantity = item.quantity;

                orderItems.push(orderItem);
            }

            // Save order items and update book stock
            await queryRunner.manager.save(OrderItem, orderItems);
            await queryRunner.manager.save(Book, booksUpdate);

            // Commit the transaction
            await queryRunner.commitTransaction();
        } catch (error) {
            // Rollback the transaction if anything goes wrong
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release the query runner after the transaction
            await queryRunner.release();
        }
    }
}
