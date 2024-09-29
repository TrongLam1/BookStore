'use client'

import Link from "next/link";

export default function HistoryOrderComponent(props: any) {

    const { item } = props;

    return (
        <tr>
            <td>#{item.id}</td>
            <td>{item.address}</td>
            <td>{item.totalPricesOrder.toLocaleString()}đ</td>
            <td>{item.createdDate}</td>
            {/* <td>{vietnamese[item.status]}</td> */}
            <td>
                <Link
                    href={`/users/order-detail/${item.id}`}
                    id="btn-order-detail" className="btn btn-primary"
                >Xem</Link>
            </td>
        </tr>
    )
}