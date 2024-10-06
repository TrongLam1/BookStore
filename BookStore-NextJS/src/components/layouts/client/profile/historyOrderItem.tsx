'use client'

import Link from "next/link";

export default function HistoryOrderItem(props: any) {

    const { order } = props;

    const date = new Date(order.createdAt);

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const formattedDate = date.toLocaleString('en-GB', options).replace(/\//g, '-');

    return (
        <tr>
            <td>#{order.id}</td>
            <td>{order.username}</td>
            <td>{order.totalPriceOrder.toLocaleString()}đ</td>
            <td>{formattedDate}</td>
            <td>{order.orderStatus}</td>
            <td>
                <Link
                    href={`/order-detail/${order.id}`}
                    id="btn-order-detail" className="btn btn-primary"
                >Xem</Link>
            </td>
        </tr>
    )
}