import { IsNotEmpty } from "class-validator";

export class UpdateCartItem {
    @IsNotEmpty()
    cartItemId: number;

    @IsNotEmpty()
    quantity: number;
}
