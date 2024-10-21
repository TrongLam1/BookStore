import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async findAllCategories() {
    return await this.categoryRepository.find({
      where: { isAvailable: true }
    });
  }

  async findByName(name: string) {
    return await this.categoryRepository.findOne({
      where: {
        categoryName: name,
        isAvailable: true
      }
    });
  }

  async findByNames(names: string[]) {
    return await this.categoryRepository.find({
      where: {
        categoryName: In([...names]),
        isAvailable: true
      }
    });
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
