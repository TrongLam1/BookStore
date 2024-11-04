import { IsEmail, IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: "Tên không được để trống." })
    username: string;

    @IsNotEmpty({ message: "Email không được để trống." })
    @IsEmail({}, { message: "Email không hợp lệ." })
    email: string;

    @IsNotEmpty({ message: "Mật khẩu không được để trống." })
    @Length(7)
    password: string;

    @IsOptional()
    provider: string;
}
