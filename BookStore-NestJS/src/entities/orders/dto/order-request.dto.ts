import { IsNotEmpty, IsOptional } from "class-validator";
import { PaymentMethod } from "../entities/order.entity";

export class OrderRequestDto {
    @IsNotEmpty({ message: "Nhập địa chỉ." })
    address: string;

    @IsNotEmpty({ message: "Nhập số điện thoại." })
    phone: string;

    @IsNotEmpty({ message: "Nhập họ tên." })
    username: string;

    @IsOptional()
    valueCoupon: number = 0;

    @IsNotEmpty({ message: "Nhập phương thức thanh toán." })
    paymentMethod: PaymentMethod;
}
