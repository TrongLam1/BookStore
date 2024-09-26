import { Injectable } from '@nestjs/common';
import { Type } from './entities/type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    return await this.typeRepository.findOne({
      where: {
        typeName: name,
        isAvailable: true
      }
    });
  }

  async findByNames(names: string[]) {
    return await this.typeRepository.find({
      where: {
        typeName: In([...names]),
        isAvailable: true
      }
    });
  }

  async findAllTypesName() {
    const [types, totalItems] = await this.typeRepository.findAndCount(
      {
        where: { isAvailable: true },
        select: ['typeName']
      }
    );

    return { types, totalItems };
  }

  async findAllTypes() {
    const [types, total] = await this.typeRepository.findAndCount({
      where: { isAvailable: true },
    });

    return types;
  }
}
