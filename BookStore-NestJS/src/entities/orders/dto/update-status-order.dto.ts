import { IsNotEmpty } from "class-validator";
import { OrderStatus } from "../entities/order.entity";

export class UpdateStatusOrderRequest {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    orderStatus: OrderStatus;
}