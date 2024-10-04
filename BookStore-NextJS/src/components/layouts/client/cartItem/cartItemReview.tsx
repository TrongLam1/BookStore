'use client'
import './cartItemReview.scss';

export default function CartItemsReview(props: any) {

    const { item } = props

    return (
        <tr className="cart_item st-item-meta">
            <td className="product-name">
                {item.book.name}&nbsp;
                <strong className="product-quantity">×{item.quantity}</strong>
            </td>
            <td className="product-total">
                <span className="woocommerce-Price-amount amount">{item.totalPrice.toLocaleString()}<span
                    className="woocommerce-Price-currencySymbol">₫</span></span>
            </td>
        </tr>
    )
}