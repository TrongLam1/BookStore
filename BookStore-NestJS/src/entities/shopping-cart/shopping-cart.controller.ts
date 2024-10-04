import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { ResponseMessage, Roles } from '@/decorator/decorator';
import { USER } from '@/role.environment';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ShoppingCartService } from './shopping-cart.service';
import { UpdateCartItem } from './dto/update-cart.dto';

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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  @ResponseMessage("Get shopping cart")
  async getShoppingCart(@Request() req) {
    return await this.shoppingCartService.getShoppingCartFromUser(req);
  }
}
