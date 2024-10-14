import { IsNotEmpty } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty({ message: "Không để trống tên coupon" })
    nameCoupon: string;

    @IsNotEmpty({ message: "Không để trống giá trị coupon" })
    valueCoupon: number;

    @IsNotEmpty({ message: "Không để trống điều kiện áp dụng coupon" })
    condition: number;

    @IsNotEmpty({ message: "Không để trống số lượng coupon" })
    quantity: number;

    @IsNotEmpty({ message: "Không để trống ngày hết hạn coupon" })
    expiredDate: Date;
}
