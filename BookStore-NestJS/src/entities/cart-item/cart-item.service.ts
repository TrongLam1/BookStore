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

  async addCartItemSession(quantity: number, book: Book, shoppingCart) {
    const cartItems = shoppingCart.cartItems;

    const maxId = cartItems.length > 0
      ? Math.max(...cartItems.map(item => item.id || 0))
      : 0;

    let cartItem = cartItems.find(item => item.book.id === book.id);
    if (!cartItem) {
      cartItem = new CartItem();
      cartItem.id = maxId + 1;
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
        shoppingCart: undefined
      }))
    };

    return cartForSession;
  }

  updateQuantityCartItemSession(quantityAdd: number, cartItemId: number, cartItems) {
    const index = cartItems.findIndex((item: CartItem) => item.id === cartItemId);

    if (index !== -1) {
      cartItems[index] = {
        ...cartItems[index],
        quantity: quantityAdd,
        totalPrice: cartItems[index].book.currentPrice * quantityAdd
      };
    }

    return cartItems;
  }

  removeCartItemSession(cartItems: CartItem[], cartItemId: number) {
    return cartItems.filter((item: CartItem) => item.id !== cartItemId);
  }

  async convertCartItemsSession(cartItems: CartItem[], shoppingCart: ShoppingCart) {
    cartItems.map(async (item: CartItem) => {
      const book = item.book;
      await this.addCartItem(item.quantity, book, shoppingCart);
    });
  }
}
