'use client'

import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CouponItemComponent(props: any) {

    const { item, setIsShowModalEditCoupon } = props;

    return (
        <tr>
            <td>#{item?.id}</td>
            <td>{item?.createdDate}</td>
            <td>{item?.expiredDate}</td>
            <td>{item?.name}</td>
            <td>{item?.quantity}</td>
            <td>{item?.valueCoupon?.toLocaleString()}đ</td>
            <td>{item?.conditionCoupon?.toLocaleString()}đ</td>
            <td>
                <button className="btn-table-dashboard" id="view-coupon" type="button" onClick={() => {
                    setIsShowModalEditCoupon(true);
                    // getDataEditCoupon(item.name);
                }}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </td>
        </tr>
    )
}