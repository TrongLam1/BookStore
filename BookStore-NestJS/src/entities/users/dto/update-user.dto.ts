import { IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    username: string;

    @IsOptional()
    password: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;
}
