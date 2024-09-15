import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateBookDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty({ message: "Vui lòng nhập tên sách." })
    name: string;

    @IsNotEmpty({ message: "Vui lòng nhập giá sách." })
    price: number;

    @IsOptional({})
    currentPrice: number;

    @IsNotEmpty({ message: "Vui lòng nhập thể loại sách." })
    typeName: string;

    @IsNotEmpty({ message: "Vui lòng nhập thương hiệu sách." })
    brandName: string;

    @IsNotEmpty({ message: "Vui lòng nhập danh mục sách." })
    categoryName: string;

    @IsOptional({})
    description: string;

    @IsOptional({})
    sale: number;

    @IsNotEmpty({ message: "Vui lòng nhập số lượng sách." })
    inventory: number;

    @IsOptional({})
    imageId: string;

    @IsOptional({})
    imageUrl: string;
}
