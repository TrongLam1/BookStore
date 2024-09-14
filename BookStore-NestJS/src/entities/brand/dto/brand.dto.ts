import { IsNotEmpty, IsOptional } from "class-validator";

export class BrandDto {
    @IsNotEmpty({ message: "Vui lòng nhập tên thương hiệu." })
    name: string;

    @IsOptional()
    isAvailable: boolean;
}
