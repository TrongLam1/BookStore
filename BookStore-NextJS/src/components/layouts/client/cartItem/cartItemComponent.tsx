/* eslint-disable @next/next/no-img-element */
'use client'
import { RemoveProductFromCart, UpdateQuantityProductCart } from '@/app/api/shoppingCartApi';
import { useShoppingCart } from '@/provider/shoppingCartProvider';
import { useEffect, useState } from 'react';
import ModalConfirm from '../../modal/modalConfirm/modalConfirm';
import './cartItemComponent.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function CartItemComponent(props: any) {

    const { item } = props;

    const { setShoppingCart } = useShoppingCart();
    const [quantity, setQuantity] = useState<number>();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setQuantity(item.quantity);
    }, [item])

    const handleRemoveProduct = async (cartItemId: number) => {
        const res = await RemoveProductFromCart(cartItemId);
        if (+res.statusCode === 200) {
            setShoppingCart({
                totalItems: res.data.totalItems,
                totalPrices: res.data.totalPrices,
                cartItems: res.data.cartItems
            })
        }
        setIsOpen(false);
    }

    const handleUpdateQuantity = async (cartItemId: number, quantity: string) => {
        setQuantity(+quantity);
        const res = await UpdateQuantityProductCart({
            cartItemId: cartItemId,
            quantity: +quantity
        });

        if (+res?.statusCode === 200) {
            setShoppingCart({
                totalItems: res?.data.totalItems,
                totalPrices: res?.data.totalPrices,
                cartItems: res?.data.cartItems
            })
        }
    }

    return (
        <>
            <li className="shopping-cart-item d-flex justify-content-between">
                <div className="d-flex">
                    <div className="cart-item-remove">
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}>
                            <FontAwesomeIcon icon={faTrash} />
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
                                    handleUpdateQuantity(item.id, e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </li>
            {
                isOpen && <ModalConfirm
                    setIsOpen={setIsOpen}
                    name={item.book.name}
                    cartItemId={item.id}
                    handleRemoveProduct={handleRemoveProduct}
                />
            }
        </>
    )
}