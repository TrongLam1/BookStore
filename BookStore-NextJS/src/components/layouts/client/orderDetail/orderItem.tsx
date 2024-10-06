/* eslint-disable @next/next/no-img-element */
'use client'

export default function OrderItem(props: any) {

    const { item } = props;

    return (
        <tr>
            <td className="order-item">
                <div>
                    <img src={item.book.imageUrl} alt="" />
                </div>
                <div className="order-item-info">
                    <div id="name">{item.book.name}</div>
                    <div id="price">{item.currentPrice.toLocaleString()}đ</div>
                </div>
            </td>
            <td>x{item.quantity}</td>
            <td className="order-item-total">{item.totalPrice.toLocaleString()}</td>
        </tr>
    );
};