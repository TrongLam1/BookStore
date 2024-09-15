import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandModule } from '../brand/brand.module';
import { CategoryModule } from '../category/category.module';
import { TypeModule } from '../type/type.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    TypeModule,
    BrandModule,
    CategoryModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule { }
