'use client'

import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

export default function CouponItemComponent(props: any) {

    const { item, setIsShowModalEditCoupon, setIdCouponUpdate } = props;

    let createdAt = item?.createdAt;
    createdAt = createdAt.toString().slice(0, 10);

    useEffect(() => { }, [item]);

    return (
        <tr>
            <td>#{item?.id}</td>
            <td>{createdAt}</td>
            <td>{item?.expiredDate}</td>
            <td>{item?.nameCoupon}</td>
            <td>{item?.quantity}</td>
            <td>{item?.valueCoupon?.toLocaleString()}đ</td>
            <td>{item?.condition?.toLocaleString()}đ</td>
            <td>
                <button className="btn-table-dashboard" id="view-coupon" type="button" onClick={() => {
                    setIsShowModalEditCoupon(true);
                    setIdCouponUpdate(item.id);
                }}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </td>
        </tr>
    )
}