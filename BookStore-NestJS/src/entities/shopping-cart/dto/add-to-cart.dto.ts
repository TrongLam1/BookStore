import { IsNotEmpty, IsOptional } from "class-validator";

export class AddToCartDto {
    @IsNotEmpty()
    bookId: number;

    @IsOptional()
    quantity: number = 1;

    @IsOptional()
    sessionId: string = null;
}
