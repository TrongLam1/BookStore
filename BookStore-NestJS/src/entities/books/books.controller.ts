import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UpdateImgBookDto } from './dto/update-img-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService
  ) { }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(process.env.ROLE_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async createNewBook(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      return this.booksService.createNewBook(createBookDto, file);
    } catch (err) {
      throw new Error(err);
    }
  }

  @Post('upload-excel')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(process.env.ROLE_ADMIN)
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return await this.booksService.uploadFileExcelBooks(file);
  }

  @Put('update-img')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(process.env.ROLE_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async updateImgBook(
    @Body() updateImgBook: UpdateImgBookDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      return this.booksService.updateImageBook(updateImgBook, file);
    } catch (err) {
      throw new Error(err);
    }
  }

  @Put('update-book')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(process.env.ROLE_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async updateBook(@Body() updateBookDto: UpdateBookDto) {
    return this.booksService.updateBook(updateBookDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(process.env.ROLE_ADMIN)
  async removeBook(@Param('id') id: number) {
    return await this.booksService.removeBook(id);
  }

  @Get('all')
  @Public()
  async findAllBooks(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('sort') sort: string,
  ) {
    return await this.booksService.findAllBooks(+current, +pageSize, sort);
  }

  @Get('find/name')
  @Public()
  async findBooksByName(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('sort') sort: string,
    @Query('name') name: string
  ) {
    return await this.booksService.findBooksByNameContain(+current, +pageSize, sort, name);
  }

  @Get('find/filter')
  @Public()
  async findBooksByFilter(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('sort') sort: string,
    @Query('typeName') typeName: string,
    @Query('brandName') brandName: string,
    @Query('categoryName') categoryName: string
  ) {
    return await this.booksService
      .findBooksByFilter(+current, +pageSize, sort, typeName, brandName, categoryName);
  }
}
