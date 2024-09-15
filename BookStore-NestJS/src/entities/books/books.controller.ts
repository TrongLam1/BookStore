import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(process.env.ROLE_ADMIN)
  @Public()
  async createNewBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.createNewBook(createBookDto);
  }

}
