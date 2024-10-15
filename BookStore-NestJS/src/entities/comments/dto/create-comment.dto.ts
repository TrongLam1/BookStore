import { IsNotEmpty } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    rating: number;

    @IsNotEmpty()
    bookId: number;
}
