import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { BrandService } from '../brand/brand.service';
import { Brand } from '../brand/entities/brand.entity';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { ExcelService } from '../excel/excel.service';
import { Type } from '../type/entities/type.entity';
import { TypeService } from '../type/type.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ExcelBookDto } from './dto/excel-book.dto';
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
    private readonly cloudinaryService: CloudinaryService,
    private readonly excelService: ExcelService
  ) { }

  validateExcelBook(excelBook: ExcelBookDto) {
    if (isNaN(excelBook.price) || excelBook.price < 0) excelBook.price = 0;
    if (isNaN(excelBook.sale) || excelBook.sale < 0) excelBook.sale = 0;
    if (isNaN(excelBook.inventory) || excelBook.inventory < 0) excelBook.inventory = 0;
    return excelBook;
  }

  async convertExcelBookToBookEntity(
    excelBooks: ExcelBookDto[],
    types: Type[],
    brands: Brand[],
    categories: Category[]) {
    const books = await Promise.all(excelBooks.map(async excelBook => {
      excelBook = this.validateExcelBook(excelBook);

      const book = new Book();
      book.name = excelBook.name;
      book.description = excelBook.description;
      book.price = excelBook.price;
      book.sale = excelBook.sale;
      book.inventory = excelBook.inventory;
      book.isAvailable = true;
      book.currentPrice = +excelBook.price - (+excelBook.price * +excelBook.sale / 100);

      const type = types.find(t => t.typeName === excelBook.type);
      const brand = brands.find(b => b.brandName === excelBook.brand);
      const category = categories.find(c => c.categoryName === excelBook.category);

      if (!type) throw new BadRequestException(`Type ${excelBook.type} not found`);
      if (!brand) throw new BadRequestException(`Brand ${excelBook.brand} not found`);
      if (!category) throw new BadRequestException(`Category ${excelBook.category} not found`);

      const files = await this.cloudinaryService.uploadFile(excelBook.file);

      book.type = type;
      book.brand = brand;
      book.category = category;
      book.imageId = files.public_id;
      book.imageUrl = files.url;

      return book;
    }));

    return books;
  }

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

  async uploadFileExcelBooks(file: Express.Multer.File) {
    const types = await this.typeService.findAllTypes();
    const brands = await this.brandService.findAllBrands();
    const categories = await this.categoryService.findAllCategories();
    const excelBooks = await this.excelService.extractDataFromExcel(file);

    const listBooks = await this.convertExcelBookToBookEntity(excelBooks, types, brands, categories);

    return await this.bookRepository.save(listBooks);
  }

  async updateBook(updateBookDto: UpdateBookDto) {
    const { id, name, price, currentPrice, typeName, brandName, categoryName,
      description, sale, inventory } = updateBookDto;

    const oldBook = await this.bookRepository.findOneBy({ id });

    if (oldBook === null) throw new NotFoundBookException();

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
      ...book, imageId: files.public_id, imageUrl: files.url
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

  async findDetailById(id: number) {
    const book = await this.bookRepository.findOne({
      where: {
        id: id,
        isAvailable: true
      },
      relations: ['category', 'brand', 'type']
    })
    if (book) return book;
    throw new NotFoundBookException();
  }

  async findAllBooks(current: number, pageSize: number, sort: string, orderBy: string) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    orderBy = !orderBy ? orderBy : 'id';
    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const [books, totalItems] = await this.bookRepository.findAndCount(
      {
        where: { isAvailable: true, inventory: MoreThan(0) },
        order: { [orderBy]: sortOrder },
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
    current: number,
    pageSize: number,
    sort: string,
    orderBy: string,
    typesString: string,
    brandsString: string,
    categoriesString: string
  ) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    orderBy = orderBy ?? 'id';
    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const listTypes = typesString !== '' ? JSON.parse(typesString) : null;
    const listBrands = brandsString !== '' ? JSON.parse(brandsString) : null;
    const listCategories = categoriesString !== '' ? JSON.parse(categoriesString) : null;

    const types = listTypes !== null ? await this.typeService.findByNames(listTypes) : null;
    const brands = listBrands !== null ? await this.brandService.findByNames(listBrands) : null;
    const categories = listCategories !== null ? await this.categoryService.findByNames(listCategories) : null;

    const whereConditions: any = {
      isAvailable: true,
      inventory: MoreThan(0)
    };

    const relations: string[] = [];

    if (types !== null) {
      whereConditions.type = types;
      relations.push('type');
    };
    if (brands !== null) {
      whereConditions.brand = brands;
      relations.push('brand');
    }
    if (categories !== null) {
      whereConditions.category = categories;
      relations.push('category');
    }

    const [books, totalItems] = await this.bookRepository.findAndCount(
      {
        where: whereConditions,
        order: { [orderBy]: sortOrder },
        take: pageSize,
        skip: (current - 1) * pageSize,
        select: selectFields,
        relations: relations
      }
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return { books, totalItems, totalPages };
  }

  async findRandomBooks() {
    return await this.bookRepository
      .createQueryBuilder('books')
      .orderBy('RAND()')
      .addOrderBy('books.rating', 'DESC')
      .addOrderBy('books.sale', 'DESC')
      .limit(5)
      .getMany();
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
