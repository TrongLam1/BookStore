import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { BrandDto } from './dto/brand.dto';
import { clearCacheWithPrefix } from '@/redis/redisOptions';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const selectFields: any = ['id', 'brandName'];
const prefix = 'api/v1/brand';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) { }

  async createNewBrand(createBrandDto: BrandDto) {
    await clearCacheWithPrefix(this.cacheManager, prefix);
    return await this.brandRepository.save({
      brandName: createBrandDto.name,
      isAvailable: true
    });
  }

  async updateBrand(updateBrandDto: BrandDto) {
    const brand = await this.brandRepository.findOneBy({ brandName: updateBrandDto.name });
    await clearCacheWithPrefix(this.cacheManager, prefix);
    return await this.brandRepository.save({
      ...brand,
      brandName: updateBrandDto.name,
      isAvailable: updateBrandDto.isAvailable ? updateBrandDto.isAvailable : brand.isAvailable
    });
  }

  async findByName(name: string) {
    return await this.brandRepository.findOne({
      where: {
        brandName: name,
        isAvailable: true
      },
      select: selectFields
    });
  }

  async findByNames(names: string[]) {
    return await this.brandRepository.find({
      where: {
        brandName: In([...names]),
        isAvailable: true
      },
      select: selectFields
    });
  }

  async findAllBrands() {
    return await this.brandRepository.find({
      where: { isAvailable: true }
    });
  }

  async removeBrand(name: string) {
    const brand = await this.brandRepository.findOneBy({ brandName: name });
    await clearCacheWithPrefix(this.cacheManager, prefix);
    return await this.brandRepository.save({
      ...brand, isAvailable: false
    });
  }
}
