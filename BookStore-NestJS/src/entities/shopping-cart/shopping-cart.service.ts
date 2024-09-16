import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { CartItemService } from '../cart-item/cart-item.service';
import { User } from '../users/entities/user.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: Repository<ShoppingCart>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly cartItemService: CartItemService,
    private readonly bookService: BooksService
  ) { }

  updateCartTotal(shoppingCart: ShoppingCart, cartItems: any) {
    let totalItems = 0;
    let totalPrices = 0.0;

    cartItems.forEach(item => {
      totalItems += item.quantity;
      totalPrices += item.totalPrice;
    });

    shoppingCart.totalPrices = totalPrices;
    shoppingCart.totalItems = totalItems;
  }

  async addProductToCart(req, bookId: number, quantity: number) {
    let user = await this.userRepository.findOne({
      where: { id: req.user.userId },
      relations: ['shoppingCart']
    });
    if (!user) throw new NotFoundException("No user");

    const book = await this.bookService.findById(bookId);
    if (!book) throw new NotFoundException("No book");

    const shoppingCart = user.shoppingCart;

    if (shoppingCart === undefined) {
      const shoppingCart = await this.shoppingCartRepository.save({});
      user = await this.userRepository.save({ ...user, shoppingCart });
    }

    await this.cartItemService.addCartItem(quantity, book, shoppingCart);

    return await this.shoppingCartRepository.save({
      ...shoppingCart,
      totalItems: shoppingCart.totalItems + quantity,
      totalPrices: shoppingCart.totalPrices + book.currentPrice * quantity
    });
  }

  async updateShoppingCart(req: any) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: req.user.userId },
      relations: ['shoppingCart', 'shoppingCart.cartItems', 'shoppingCart.cartItems.book']
    });
    const shoppingCart = user.shoppingCart;
    const cartItems = user.shoppingCart.cartItems;

    this.updateCartTotal(shoppingCart, cartItems);

    return await this.shoppingCartRepository.save(shoppingCart);
  }

  async removeCartItemInCart(req: any, bookId: number) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: req.user.userId },
      relations: ['shoppingCart', 'shoppingCart.cartItems', 'shoppingCart.cartItems.book']
    });
    const shoppingCart = user.shoppingCart;
    const cartItems = user.shoppingCart.cartItems;

    const bookRemove = await this.bookService.findById(bookId);

    await this.cartItemService.removeCartItem(bookRemove, shoppingCart);

    const updatedCartItems = cartItems.filter(item => item.book.id !== bookRemove.id);

    this.updateCartTotal(shoppingCart, updatedCartItems);

    return await this.shoppingCartRepository.save(shoppingCart);
  }

  async getShoppingCartFromUser(req) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: req.user.userId },
      relations: ['shoppingCart', 'shoppingCart.cartItems', 'shoppingCart.cartItems.book']
    });
    return user.shoppingCart.cartItems;
  }
}
