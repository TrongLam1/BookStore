import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
      where: { isAvailable: true },
      select: ['brandName']
    });
  }

  async removeBrand(name: string) {
    const brand = await this.brandRepository.findOneBy({ brandName: name });
    return await this.brandRepository.save({
      ...brand, isAvailable: false
    });
  }
}
