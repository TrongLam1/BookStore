import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from '../books/books.module';
import { CartItemModule } from '../cart-item/cart-item.module';
import { User } from '../users/entities/user.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingCart]),
    TypeOrmModule.forFeature([User]),
    CartItemModule,
    BooksModule
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule { }
