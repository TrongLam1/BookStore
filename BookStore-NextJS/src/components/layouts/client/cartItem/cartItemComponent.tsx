/* eslint-disable @next/next/no-img-element */
'use client'
import { useState } from 'react';
import './cartItemComponent.scss';
import { AddProductToCart } from '@/app/api/shoppingCartApi';

export default function CartItemComponent(props: any) {

    const { item } = props;

    const [quantity, setQuantity] = useState(item.quantity);

    const handleRemoveProduct = (productId: number) => { }

    const handleUpdateQuantity = async (productId: string, quantity: string) => {
        const res = await AddProductToCart({ bookId: +productId, quantity: +quantity });
        console.log(res);
    }

    return (
        <li className="shopping-cart-item d-flex justify-content-between">
            <div className="d-flex">
                <div className="cart-item-remove">
                    <button
                        type="button"
                        onClick={() =>
                            handleRemoveProduct(item.book.id)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="cart-item-img">
                    <img src={item.book.imageUrl} alt={item.book.name} />
                </div>
                <div className="cart-item-info">
                    <div className="cart-item-name">
                        {item.book.name}
                    </div>
                    <div className="cart-item-price">
                        {item.book.currentPrice.toLocaleString()}đ
                    </div>
                </div>
            </div>
            <div className="subtotal">
                <div className="cart-item-subtotal">
                    {item.totalPrice.toLocaleString()}đ
                </div>
                <div className="cart-item-quantity-wrapper">
                    <div className="cart-item-quantity">
                        <input
                            type="number"
                            value={quantity}
                            min={1}
                            onChange={(e) => {
                                setQuantity(e.target.value);
                                handleUpdateQuantity(item.book.id, e.target.value);
                            }}
                        />
                    </div>
                </div>
            </div>
        </li>
    )
}