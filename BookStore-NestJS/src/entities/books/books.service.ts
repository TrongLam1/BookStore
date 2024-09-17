import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from '../category/category.service';
import { TypeService } from '../type/type.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UpdateImgBookDto } from './dto/update-img-book.dto';
import { Book } from './entities/book.entity';
import { NotFoundBookException } from './exception/CustomizeExceptionBook';

const selectFields: any = ['id', 'createdAt', 'updatedAt', 'name', 'brand', 'type', 'category', 'price', 'currentPrice', 'sale', 'description', 'inventory', 'imageUrl'];

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private readonly typeService: TypeService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async createNewBook(createBookDto: CreateBookDto, file: Express.Multer.File) {
    const { name, price, typeName, brandName, categoryName,
      description, sale, inventory } = createBookDto;

    const files = await this.cloudinaryService.uploadFile(file);

    const type = await this.typeService.findByName(typeName);
    const brand = await this.brandService.findByName(brandName);
    const category = await this.categoryService.findByName(categoryName);

    const currentPrice = +price - (+price * +sale / 100);

    return await this.bookRepository.save({
      name, price: +price, currentPrice: currentPrice,
      type, brand, category,
      description, sale, inventory,
      imageId: files.public_id,
      imageUrl: files.url
    });
  }

  async updateBook(updateBookDto: UpdateBookDto) {
    const { id, name, price, currentPrice, typeName, brandName, categoryName,
      description, sale, inventory } = updateBookDto;

    const oldBook = await this.bookRepository.findOneBy({ id });

    if (oldBook) throw new NotFoundBookException();

    const type = typeName ? await this.typeService.findByName(typeName) : oldBook.type;
    const brand = brandName ? await this.brandService.findByName(brandName) : oldBook.brand;
    const category = categoryName ?
      await this.categoryService.findByName(categoryName) :
      oldBook.category;

    return await this.bookRepository.save({
      id: oldBook.id,
      name, price, currentPrice, type, brand, category,
      description, sale, inventory
    });
  }

  async updateImageBook(updImgDto: UpdateImgBookDto, file: Express.Multer.File) {
    const book = await this.bookRepository.findOneBy({ id: updImgDto.id });

    await this.cloudinaryService.deleteFile(book.imageId);
    const files = await this.cloudinaryService.uploadFile(file);

    return await this.bookRepository.save({
      ...book, imageId: files.imageId, imageUrl: files.imageUrl
    });
  }

  async updateListBooks(listBooks: Book[]) {
    await this.bookRepository.save(listBooks);
  }

  async findById(id: number) {
    const book = await this.bookRepository.findOne({
      where: {
        id: id,
        isAvailable: true,
        inventory: MoreThan(0)
      }
    })
    if (book) return book;
    throw new NotFoundBookException();
  }

  async findAllBooks(current: number, pageSize: number, sort: string) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const [books, totalItems] = await this.bookRepository.findAndCount(
      {
        where: { isAvailable: true, inventory: MoreThan(0) },
        order: { id: sortOrder },
        take: pageSize,
        skip: (current - 1) * pageSize,
        select: selectFields
      }
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return { books, totalItems, totalPages };
  }

  async findBooksByNameContain(current: number, pageSize: number, sort: string, name: string) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const [books, totalItems] = await this.bookRepository.findAndCount(
      {
        where: {
          name: Like('%' + name + '%'),
          isAvailable: true,
          inventory: MoreThan(0)
        },
        order: { id: sortOrder },
        take: pageSize,
        skip: (current - 1) * pageSize,
        select: selectFields
      }
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return { books, totalItems, totalPages };
  }

  async findBooksByFilter(
    current: number, pageSize: number, sort: string,
    typeName: string, brandName: string, categoryName: string
  ) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const type = typeName ? await this.typeService.findByName(typeName) : null;
    const brand = brandName ? await this.brandService.findByName(brandName) : null;
    const category = categoryName ? await this.categoryService.findByName(categoryName) : null;

    const whereConditions: any = {
      isAvailable: true,
      inventory: MoreThan(0)
    };

    if (type) whereConditions.type = type;
    if (brand) whereConditions.brand = brand;
    if (category) whereConditions.category = category;

    const [books, totalItems] = await this.bookRepository.findAndCount(
      {
        where: whereConditions,
        order: { id: sortOrder },
        take: pageSize,
        skip: (current - 1) * pageSize,
        select: selectFields
      }
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return { books, totalItems, totalPages };
  }

  async removeBook(id: number) {
    let book = await this.bookRepository.findOneBy({ id });
    book = await this.bookRepository.save({
      ...book, isAvailable: false
    });
    return {
      id: book.id,
      name: book.name,
      isAvailable: book.isAvailable
    }
  }
}
