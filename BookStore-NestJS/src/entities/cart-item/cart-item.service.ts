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
      },
      relations: ['book']
    });
    if (cartItem === null) {
      cartItem = new CartItem();
      cartItem.book = book;
      cartItem.shoppingCart = shoppingCart;
      cartItem.totalPrice = book.currentPrice * quantity;
      cartItem.quantity = quantity;
      return await this.cartItemRepository.save(cartItem);
    } else {
      return await this.cartItemRepository.save({
        ...cartItem,
        quantity: quantity === 1 ? ++cartItem.quantity : quantity,
        totalPrice: book.currentPrice * cartItem.quantity
      });
    }
  }

  async updateQuantityCartItem(quantity: number, cartItemId: number, shoppingCart: ShoppingCart) {
    const cartItem = await this.cartItemRepository.findOneOrFail({
      where: {
        id: cartItemId,
        shoppingCart: { id: shoppingCart.id }
      },
      relations: ['book']
    });
    return await this.cartItemRepository.save({
      ...cartItem,
      quantity: quantity,
      totalPrice: cartItem.book.currentPrice * quantity
    })
  }

  async removeCartItem(cartItemId: number, shoppingCart: ShoppingCart) {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        id: cartItemId,
        shoppingCart: { id: shoppingCart.id }
      }
    });
    return await this.cartItemRepository.remove(cartItem);
  }

  async clearCartItems(items: CartItem[]) {
    await this.cartItemRepository.remove(items);
  }

  async addCartItemSession(quantity: number, book: Book, session) {
    const shoppingCart = session.shoppingCart;
    const cartItems = shoppingCart.cartItems;
    let cartItem = cartItems.find(item => item.book.id === book.id);
    if (!cartItem) {
      cartItem = new CartItem();
      cartItem.book = book;
      cartItem.shoppingCart = shoppingCart;
      cartItem.totalPrice = book.currentPrice * quantity;
      cartItem.quantity = quantity;
      cartItems.push(cartItem);
    } else {
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * book.currentPrice;
    }

    shoppingCart.totalItems = cartItems.length;
    shoppingCart.totalPrices = cartItems.reduce((total, item) => total + item.totalPrice, 0);

    const cartForSession = {
      ...shoppingCart,
      cartItems: shoppingCart.cartItems.map(item => ({
        ...item,
        shoppingCart: undefined // Remove circular reference
      }))
    };

    // Save the non-circular cart to the session
    session.shoppingCart = cartForSession;
    return session.shoppingCart;
  }

  async updateQuantityCartItemSession(quantityAdd: number, cartItem: CartItem, book: Book) {
    const add = quantityAdd - cartItem.quantity;
    if (add === 1) {
      quantityAdd++;
    }
    return {
      ...cartItem,
      quantity: quantityAdd,
      totalPrice: book.currentPrice * cartItem.quantity
    };
  }
}
