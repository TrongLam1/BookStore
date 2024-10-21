import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { CartItemService } from '../cart-item/cart-item.service';
import { User } from '../users/entities/user.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { NotEnoughBookException } from '../books/exception/CustomizeExceptionBook';

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

  private updateCartTotal(shoppingCart: ShoppingCart, cartItems: CartItem[]) {
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
      relations: ['shoppingCart', 'shoppingCart.cartItems']
    });
    if (!user) throw new NotFoundException("No user");

    const book = await this.bookService.findById(bookId);
    if (!book) throw new NotFoundException("No book");
    if (book.inventory < quantity) throw new NotEnoughBookException();

    let shoppingCart = user.shoppingCart;

    if (shoppingCart === null) {
      shoppingCart = await this.shoppingCartRepository.save({});
      user = await this.userRepository.save({ ...user, shoppingCart });
    }

    await this.cartItemService.addCartItem(quantity, book, shoppingCart);

    return await this.updateShoppingCart(req);
  }

  async updateQuantityProduct(req, quantity: number, cartItemId: number) {
    const user = await this.userRepository.findOne({
      where: { id: req.user.userId },
      relations: ['shoppingCart', 'shoppingCart.cartItems']
    });
    if (!user) throw new NotFoundException("No user");

    const shoppingCart = user.shoppingCart;

    await this.cartItemService.updateQuantityCartItem(quantity, cartItemId, shoppingCart);

    return await this.updateShoppingCart(req);
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

  async removeCartItemInCart(req: any, cartItemId: number) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: req.user.userId },
      relations: ['shoppingCart', 'shoppingCart.cartItems']
    });
    const shoppingCart = user.shoppingCart;

    await this.cartItemService.removeCartItem(cartItemId, shoppingCart);

    return await this.updateShoppingCart(req);
  }

  async getShoppingCartFromUserInternal(req) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: req.user.userId },
      relations: ['shoppingCart', 'shoppingCart.cartItems', 'shoppingCart.cartItems.book']
    });
    return user;
  }

  async getShoppingCartFromUser(req) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: req.user.userId },
      relations: ['shoppingCart', 'shoppingCart.cartItems', 'shoppingCart.cartItems.book']
    });
    return user.shoppingCart;
  }

  async clearShoppingCart(cartItems: CartItem[], shoppingCart: ShoppingCart) {
    await this.cartItemService.clearCartItems(cartItems);
    return await this.shoppingCartRepository.save({
      ...shoppingCart, totalItems: 0, totalPrices: 0,
    });
  }

  async addProductToCartSession(session, bookId: number, quantity: number) {
    console.log(">>>>>>>>>>>>>> Session: ", session);
    const book = await this.bookService.findById(bookId);
    if (!book) throw new NotFoundException("No book");
    if (book.inventory < quantity) throw new NotEnoughBookException();

    if (session?.shoppingCart === undefined) {
      session.shoppingCart = {
        totalItems: 0,
        totalPrices: 0,
        cartItems: []
      };
    }

    return await this.cartItemService.addCartItemSession(quantity, book, session);
  }
}
