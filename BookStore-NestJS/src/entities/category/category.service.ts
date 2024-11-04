import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { clearCacheWithPrefix } from '@/redis/redisOptions';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const prefix = 'api/v1/category';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) { }

  async createNewCategory(createCategoryDto: CreateCategoryDto) {
    await clearCacheWithPrefix(this.cacheManager, prefix);
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
    await clearCacheWithPrefix(this.cacheManager, prefix);
    return await this.categoryRepository.save({
      ...category,
      categoryName: updateCategoryDto.categoryName
    });
  }

  async removeCategory(name: string) {
    const category = await this.findByName(name);
    await clearCacheWithPrefix(this.cacheManager, prefix);
    return await this.categoryRepository.save({
      ...category, isAvailable: false
    });
  }
}
