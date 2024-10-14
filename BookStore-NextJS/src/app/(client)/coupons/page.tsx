import { GetCouponsValid } from "@/app/api/couponApi";
import ListCoupons from "@/components/layouts/client/coupon/listCoupons";

export default async function CouponPage() {

    const res = await GetCouponsValid(1);

    return (
        <ListCoupons coupons={res.data.listCoupons} />
    )
}