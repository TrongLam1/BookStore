import { Injectable } from '@nestjs/common';
import { Type } from './entities/type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeDto } from './dto/type.dto';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private typeRepository: Repository<Type>
  ) { }

  async createNewType(typeDto: TypeDto) {
    return await this.typeRepository.save({ typeName: typeDto.typeName });
  }

  async updateType(typeDto: TypeDto) {
    const type = await this.typeRepository.findOneBy({ typeName: typeDto.typeName });
    return await this.typeRepository.save({
      ...type,
      typeName: typeDto.typeName,
      isAvailable: typeDto.isAvailable ? typeDto.isAvailable : type.isAvailable
    })
  }

  async findByName(name: string) {
    return await this.typeRepository.findOneBy({ typeName: name });
  }

  async findAllTypes(current: number, pageSize: number, sort: string) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const sortOrder: 'ASC' | 'DESC' = sort === 'DESC' ? 'DESC' : 'ASC';

    const [types, totalItems] = await this.typeRepository.findAndCount(
      {
        order: { id: sortOrder },
        take: pageSize,
        skip: (current - 1) * pageSize
      }
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return { types, totalItems, totalPages };
  }
}
