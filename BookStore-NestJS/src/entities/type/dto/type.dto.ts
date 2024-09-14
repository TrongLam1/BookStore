import { IsNotEmpty, IsOptional } from "class-validator";

export class TypeDto {
    @IsNotEmpty({ message: "Vui lòng không để trống tên thể loại." })
    typeName: string;

    @IsOptional()
    isAvailable: boolean;
}
