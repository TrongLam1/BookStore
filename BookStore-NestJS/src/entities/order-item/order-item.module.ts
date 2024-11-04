import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemService } from './order-item.service';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem]),
    BooksModule
  ],
  providers: [OrderItemService],
  exports: [OrderItemService]
})
export class OrderItemModule { }
