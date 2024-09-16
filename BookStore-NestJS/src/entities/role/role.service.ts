import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) { }

  async createNewRole(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.save({
      name: createRoleDto.name
    });
  }

  async findRoleByName(roleName: string) {
    return await this.roleRepository.findOneBy({ name: roleName });
  }
}
