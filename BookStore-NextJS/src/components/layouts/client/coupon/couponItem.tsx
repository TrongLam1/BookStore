'use client'

import { toast } from "react-toastify";

export default function CouponItem(props: any) {

    const { item, col } = props;

    const copyCoupon = () => {
        navigator.clipboard.writeText(item.nameCoupon);
        toast.success("Đã copy coupon.");
    }

    return (
        <div className={`coupon ${col !== undefined ? col : ''}`}>
            <div className="coupon-heading">NHẬP MÃ:
                <input type="text" className="coupon-name" disabled value={item.nameCoupon} />
            </div>
            <div className="coupon-body d-flex flex-column">
                <span>- Mã giảm {item.valueCoupon.toLocaleString()}đ</span>
                <span>- Có hiệu lực đến ngày {item.expiredDate}</span>
            </div>
            <div className="coupon-copy">
                <button type="button" onClick={() => copyCoupon()}>
                    <span>Sao chép</span>
                </button>
            </div>
        </div >
    )
}