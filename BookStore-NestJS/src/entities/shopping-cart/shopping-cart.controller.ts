import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, ResponseMessage, Roles } from '@/decorator/decorator';
import { USER } from '@/role.environment';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItem } from './dto/update-cart.dto';
import { ShoppingCartService } from './shopping-cart.service';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  @ResponseMessage("Add product to cart")
  async addProductToCart(
    @Request() req,
    @Body() addToCartDto: AddToCartDto
  ) {
    return await this.shoppingCartService
      .addProductToCart(req, addToCartDto.bookId, addToCartDto.quantity);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  @ResponseMessage("Update quantity's product cart")
  async updateQuantityProductCart(
    @Request() req,
    @Body() updateCartItem: UpdateCartItem
  ) {
    return await this.shoppingCartService
      .updateQuantityProduct(req, updateCartItem.quantity, updateCartItem.cartItemId);
  }

  @Delete('remove-product/:cartItemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  @ResponseMessage("Remove product from cart")
  async removeProductFromCart(
    @Request() req,
    @Param('cartItemId') cartItemId: number
  ) {
    return await this.shoppingCartService
      .removeCartItemInCart(req, cartItemId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  @ResponseMessage("Get shopping cart")
  async getShoppingCart(@Request() req, @Param('userId') userId: number) {
    return await this.shoppingCartService.getShoppingCartFromUser(req);
  }

  // -------------------------------- Session --------------------------------

  @Post('session')
  @Public()
  @ResponseMessage("Add product to cart")
  async addProductToCartSession(
    @Req() req,
    @Body() addToCartDto: AddToCartDto
  ) {
    const session = addToCartDto.sessionId ?? req.session.id;
    return await this.shoppingCartService
      .addProductToCartSession(session, addToCartDto.bookId, addToCartDto.quantity);
  }

  @Get('session')
  @Public()
  @ResponseMessage("Get shopping cart from session")
  async getShoppingCartSession(
    @Req() req,
    @Query('sessionId') sessionId: string,
  ) {
    const session = sessionId === null ? req.session.id : sessionId;
    return await this.shoppingCartService.getShoppingCartSession(session);
  }

  @Put('session')
  @Public()
  @ResponseMessage("Update quantity's product cart")
  async updateQuantityProductCartSession(
    @Query('sessionId') sessionId: string,
    @Body() updateCartItem: UpdateCartItem
  ) {
    return await this.shoppingCartService
      .updateQuantityProductSession(sessionId, updateCartItem.quantity, updateCartItem.cartItemId);
  }

  @Delete('session')
  @Public()
  @ResponseMessage("Remove cart item session")
  async removeCartItemSession(
    @Query('sessionId') sessionId: string,
    @Query('cartItemId') cartItemId: number,
  ) {
    return await this.shoppingCartService
      .removeCartItemSession(sessionId, cartItemId);
  }

  @Post('convert-session')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  @ResponseMessage("Convert shopping cart")
  async convertShoppingCartFromSession(@Req() req, @Query('sessionId') sessionId: string) {
    return await this.shoppingCartService.convertShoppingCartSession(req, sessionId);
  }
}
