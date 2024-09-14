import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { BrandDto } from './dto/brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>
  ) { }

  async createNewBrand(createBrandDto: BrandDto) {
    return await this.brandRepository.save({ brandName: createBrandDto.name });
  }

  async updateBrand(updateBrandDto: BrandDto) {
    const brand = await this.brandRepository.findOneBy({ brandName: updateBrandDto.name });
    return await this.brandRepository.save({
      ...brand,
      brandName: updateBrandDto.name,
      isAvailable: updateBrandDto.isAvailable ? updateBrandDto.isAvailable : brand.isAvailable
    });
  }

  async findAllBrands(current: number, pageSize: number, sort: string) {
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const [brands, totalItems] = await this.brandRepository.findAndCount(
      {
        order: { id: sortOrder },
        take: pageSize,
        skip: (current - 1) * pageSize
      }
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return { brands, totalItems, totalPages };
  }
}
