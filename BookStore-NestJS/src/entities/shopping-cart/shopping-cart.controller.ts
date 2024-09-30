import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { ResponseMessage, Roles } from '@/decorator/decorator';
import { USER } from '@/role.environment';
import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
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

  @Delete('remove-product/:bookId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  @ResponseMessage("Remove product from cart")
  async removeProductFromCart(
    @Request() req,
    @Param('bookId') bookId: number
  ) {
    return await this.shoppingCartService
      .removeCartItemInCart(req, bookId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  @ResponseMessage("Get shopping cart")
  async getShoppingCart(@Request() req) {
    return await this.shoppingCartService.getShoppingCartFromUser(req);
  }
}
