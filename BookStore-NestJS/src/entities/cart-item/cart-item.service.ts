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
    let cartItem = await this.cartItemRepository.findOne({
      where: {
        book: { id: book.id },
        shoppingCart: { id: shoppingCart.id }
      }
    });
    if (cartItem === null) {
      cartItem = new CartItem();
      cartItem.book = book;
      cartItem.shoppingCart = shoppingCart;
      cartItem.totalPrice = book.currentPrice * quantity;
      cartItem.quantity = quantity;
      return await this.cartItemRepository.save(cartItem);
    }
    this.updateQuantityCartItem(quantity, cartItem, book);
  }

  async updateQuantityCartItem(quantityAdd: number, cartItem: CartItem, book: Book) {
    return await this.cartItemRepository.save({
      ...cartItem,
      quantity: cartItem.quantity + quantityAdd,
      totalPrice: book.currentPrice * cartItem.quantity
    });
  }

  async removeCartItem(book: Book, shoppingCart: ShoppingCart) {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        book: { id: book.id },
        shoppingCart: { id: shoppingCart.id }
      }
    });
    await this.cartItemRepository.remove(cartItem);
  }

  async clearCartItems(items: CartItem[]) {
    await this.cartItemRepository.remove(items);
  }
}
