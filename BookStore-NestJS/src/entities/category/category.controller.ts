import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Public, Roles } from '@/decorator/decorator';
import { ADMIN } from '@/role.environment';
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async createNewCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createNewCategory(createCategoryDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryService.updateCategory(updateCategoryDto);
  }

  @Get('all')
  @Public()
  async findAllCategories() {
    return await this.categoryService.findAllCategoriesName();
  }
}
