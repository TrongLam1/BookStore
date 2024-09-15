import { IsNotEmpty } from "class-validator";

export class UpdateCategoryDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty({ message: "Vui lòng nhập tên danh mục." })
    categoryName: string;
}
