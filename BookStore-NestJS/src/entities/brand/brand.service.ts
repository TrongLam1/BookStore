import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { BrandDto } from './dto/brand.dto';

const selectFields: any = ['id', 'brandName'];

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>
  ) { }

  async createNewBrand(createBrandDto: BrandDto) {
    return await this.brandRepository.save({
      brandName: createBrandDto.name,
      isAvailable: true
    });
  }

  async updateBrand(updateBrandDto: BrandDto) {
    const brand = await this.brandRepository.findOneBy({ brandName: updateBrandDto.name });
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

  async findAllBrands(current: number, pageSize: number, sort: string) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const [brands, totalItems] = await this.brandRepository.findAndCount(
      {
        where: { isAvailable: true },
        order: { id: sortOrder },
        take: pageSize,
        skip: (current - 1) * pageSize,
        select: selectFields
      }
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return { brands, totalItems, totalPages };
  }

  async removeBrand(name: string) {
    const brand = await this.brandRepository.findOneBy({ brandName: name });
    return await this.brandRepository.save({
      ...brand, isAvailable: false
    });
  }
}
