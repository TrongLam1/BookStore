import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { CartItemService } from '../cart-item/cart-item.service';
import { User } from '../users/entities/user.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { NotEnoughBookException } from '../books/exception/CustomizeExceptionBook';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-store';

@Injectable()
export class ShoppingCartService {
  private readonly redisStore!: RedisStore;
  constructor(
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: Repository<ShoppingCart>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly cartItemService: CartItemService,
    private readonly bookService: BooksService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {
    this.redisStore = cacheManager.store as unknown as RedisStore;
  }

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
    let shoppingCart = user.shoppingCart;
    const cartItems = user.shoppingCart.cartItems;

    this.updateCartTotal(shoppingCart, cartItems);

    const key = `/api/v1/shopping-cart/user/${req.user.userId}`;
    await this.cacheManager.set(key, JSON.stringify(shoppingCart));

    shoppingCart = await this.shoppingCartRepository.save(shoppingCart);
    return shoppingCart;
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

  async convertShoppingCartSession(req, sessionId: string) {
    let user = await this.userRepository.findOne({
      where: { id: req.user.userId },
      relations: ['shoppingCart', 'shoppingCart.cartItems']
    });
    if (!user) throw new NotFoundException("No user");

    let shoppingCart = user.shoppingCart;

    if (shoppingCart === null) {
      shoppingCart = await this.shoppingCartRepository.save({});
      user = await this.userRepository.save({ ...user, shoppingCart });
    }

    const shoppingCartString: string = await this.cacheManager.get(sessionId) || null;
    if (!shoppingCartString) return;

    const shoppingCartSession = JSON.parse(shoppingCartString);
    await this.cartItemService.convertCartItemsSession(shoppingCartSession.cartItems, shoppingCart);

    const key = `/api/v1/shopping-cart/session?sessionId=${sessionId}`;
    await this.cacheManager.del(sessionId);
    await this.cacheManager.del(key);

    await this.updateShoppingCart(req);
  }

  // --------------------------- Session ------------------------------
  async getShoppingCartSession(sessionId: string) {
    const shoppingCartString: string = await this.cacheManager.get(sessionId) || null;
    let shoppingCart;
    if (shoppingCartString === null) {
      shoppingCart = {
        totalItems: 0,
        totalPrices: 0,
        cartItems: []
      };
      await this.cacheManager.set(sessionId, JSON.stringify(shoppingCart));
    } else {
      shoppingCart = JSON.parse(shoppingCartString);
    }

    return { shoppingCart };
  }

  async addProductToCartSession(sessionId: string, bookId: number, quantity: number) {
    const book = await this.bookService.findById(bookId);
    if (!book) throw new NotFoundException("No book");
    if (book.inventory < quantity) throw new NotEnoughBookException();

    const shoppingCartString: string = await this.cacheManager.get(sessionId);
    let shoppingCart;
    if (shoppingCartString === null) {
      shoppingCart = {
        totalItems: 0,
        totalPrices: 0,
        cartItems: []
      };
    } else {
      shoppingCart = JSON.parse(shoppingCartString);
    }

    shoppingCart = await this.cartItemService.addCartItemSession(quantity, book, shoppingCart);
    this.updateCartTotal(shoppingCart, shoppingCart.cartItems);
    const key = `/api/v1/shopping-cart/session?sessionId=${sessionId}`;
    await this.cacheManager.set(key, JSON.stringify(shoppingCart));
    await this.cacheManager.set(sessionId, JSON.stringify(shoppingCart));
    return {
      sessionId, shoppingCart
    };
  }

  async updateQuantityProductSession(sessionId: string, quantity: number, cartItemId: number) {
    const shoppingCartString: string = await this.cacheManager.get(sessionId);
    const shoppingCart = JSON.parse(shoppingCartString);

    shoppingCart.cartItems = await this.cartItemService.updateQuantityCartItemSession(quantity, cartItemId, shoppingCart.cartItems);

    this.updateCartTotal(shoppingCart, shoppingCart.cartItems);

    const key = `/api/v1/shopping-cart/session?sessionId=${sessionId}`;
    await this.cacheManager.set(key, JSON.stringify(shoppingCart));
    await this.cacheManager.set(sessionId, JSON.stringify(shoppingCart));

    return { shoppingCart };
  }

  async removeCartItemSession(sessionId: string, cartItemId: number) {
    const shoppingCartString: string = await this.cacheManager.get(sessionId);
    const shoppingCart = JSON.parse(shoppingCartString);

    shoppingCart.cartItems = this.cartItemService.removeCartItemSession(shoppingCart.cartItems, +cartItemId);

    this.updateCartTotal(shoppingCart, shoppingCart.cartItems);

    const key = `/api/v1/shopping-cart/session?sessionId=${sessionId}`;
    await this.cacheManager.set(key, JSON.stringify(shoppingCart));
    await this.cacheManager.set(sessionId, JSON.stringify(shoppingCart));

    return { shoppingCart };
  }
}
