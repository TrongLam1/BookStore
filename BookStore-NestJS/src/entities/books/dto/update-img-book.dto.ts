import { IsNotEmpty } from "class-validator";

export class UpdateImgBookDto {
    @IsNotEmpty()
    id: number;
}
