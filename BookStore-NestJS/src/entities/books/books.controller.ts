import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { ADMIN } from '@/role.environment';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
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
  @Roles(ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return await this.booksService.uploadFileExcelBooks(file);
  }

  @Get('export-excel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async exportFile(@Res() res: Response) {
    return await this.booksService.exportFileBooks(res);
  }

  @Put('update-img')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
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
  @Roles(ADMIN)
  async updateBook(@Body() updateBookDto: UpdateBookDto) {
    return this.booksService.updateBook(updateBookDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async removeBook(@Param('id') id: number) {
    return await this.booksService.removeBook(id);
  }

  @Get('all')
  @Public()
  @UseInterceptors(CacheInterceptor)
  async findAllBooks(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('sort') sort: string,
    @Query('orderBy') orderBy: string,
  ) {
    return await this.booksService.findAllBooks(+current, +pageSize, sort, orderBy);
  }

  @Get('find/name')
  @Public()
  @UseInterceptors(CacheInterceptor)
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
  @UseInterceptors(CacheInterceptor)
  async findBooksByFilter(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('sort') sort: string,
    @Query('orderBy') orderBy: string,
    @Query('typesString') typesString: string,
    @Query('brandsString') brandsString: string,
    @Query('categoriesString') categoriesString: string
  ) {
    return await this.booksService
      .findBooksByFilter(+current, +pageSize, sort, orderBy, typesString, brandsString, categoriesString);
  }

  @Get('/random')
  @Public()
  @UseInterceptors(CacheInterceptor)
  async getRandomBooks() {
    return await this.booksService.findRandomBooks();
  }

  @Get('find-one/:id')
  @Public()
  @UseInterceptors(CacheInterceptor)
  async findBookById(@Param('id') id: string) {
    return await this.booksService.findDetailById(+id);
  }
}
