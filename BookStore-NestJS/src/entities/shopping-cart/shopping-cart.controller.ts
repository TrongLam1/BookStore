import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Roles } from '@/decorator/decorator';
import { USER } from '@/role.environment';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  async addProductToCart(
    @Request() req,
    @Body() addToCartDto: AddToCartDto
  ) {
    return await this.shoppingCartService
      .addProductToCart(req, addToCartDto.bookId, addToCartDto.quantity);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER)
  async getShoppingCart(@Request() req) {
    return await this.shoppingCartService.getShoppingCartFromUser(req);
  }
}
