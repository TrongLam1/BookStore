import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../books/entities/book.entity';
import { ShoppingCart } from '../shopping-cart/entities/shopping-cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>
  ) { }

  async addCartItem(quantity: number, book: Book, shoppingCart: ShoppingCart) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { book: book, shoppingCart: shoppingCart }
    });
    if (!cartItem) {
      cartItem.book = book;
      cartItem.shoppingCart = shoppingCart;
      cartItem.totalPrice = book.currentPrice * quantity;
      cartItem.quantity = quantity;
      return await this.cartItemRepository.save(cartItem);
    }
    this.updateQuantityCartItem(quantity, cartItem);
  }

  async updateQuantityCartItem(quantity: number, cartItem: CartItem) {
    return await this.cartItemRepository.save({
      ...cartItem, quantity: quantity
    })
  }

  async removeCartItem(book: Book, shoppingCart: ShoppingCart) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { book: book, shoppingCart: shoppingCart }
    });
    await this.cartItemRepository.remove(cartItem);
  }
}
