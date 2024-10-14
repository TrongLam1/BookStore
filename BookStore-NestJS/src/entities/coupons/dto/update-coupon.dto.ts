import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateCouponDto {
    @IsNotEmpty({ message: "Không để trống id coupon" })
    id: number;

    @IsOptional()
    valueCoupon: number;

    @IsOptional()
    condition: number;

    @IsOptional()
    quantity: number;

    @IsOptional()
    expiredDate: Date;
}
