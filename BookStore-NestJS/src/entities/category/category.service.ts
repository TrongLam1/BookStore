import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) { }

  async createNewCategory(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save({ categoryName: createCategoryDto.categoryName });
  }

  async findAllCategories(current: number, pageSize: number, sort: string) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const [categories, totalItems] = await this.categoryRepository.findAndCount(
      {
        where: { isAvailable: true },
        order: { id: sortOrder },
        take: pageSize,
        skip: (current - 1) * pageSize
      }
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return { categories, totalItems, totalPages };
  }

  async findByName(name: string) {
    return await this.categoryRepository.findOneBy({ categoryName: name });
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id: updateCategoryDto.id });
    return await this.categoryRepository.save({
      ...category,
      categoryName: updateCategoryDto.categoryName
    });
  }

  async removeCategory(name: string) {
    const category = await this.findByName(name);
    return await this.categoryRepository.save({
      ...category, isAvailable: false
    });
  }
}
