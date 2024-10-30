/* eslint-disable @next/next/no-img-element */
'use client'
import { RemoveProductFromCart, RemoveProductFromCartSession, UpdateQuantityProductCart, UpdateQuantityProductCartSession } from '@/app/api/shoppingCartApi';
import { useShoppingCart } from '@/provider/shoppingCartProvider';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import { useState } from 'react';
import ModalConfirm from '../../modal/modalConfirm/modalConfirm';
import './cartItemHeader.scss';

export default function CartItemHeaderComponent(props: any) {
    const { cartItem, user, token } = props;
    const { setShoppingCart } = useShoppingCart();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [quantity, setQuantity] = useState(cartItem.quantity);

    const product: IBook = cartItem?.book;

    const handleRemoveProduct = async (cartItemId: number) => {
        if (user) {
            const res = await RemoveProductFromCart(cartItemId);
            if (+res.statusCode === 200) {
                setShoppingCart({
                    totalItems: res.data.totalItems,
                    totalPrices: res.data.totalPrices,
                    cartItems: res.data.cartItems
                })
            }
        } else {
            const sessionId = Cookies.get('sessionId');
            const res = await RemoveProductFromCartSession(sessionId, +cartItemId);
            if (res.statusCode === 200) {
                setShoppingCart(res.data.shoppingCart);
            }
        }
        setIsOpen(false);
    }

    const handleUpdateQuantity = async (cartItemId: number, quantity: string) => {
        setQuantity(+quantity);
        if (user) {
            const res = await UpdateQuantityProductCart({
                cartItemId: cartItemId,
                quantity: +quantity
            });

            if (+res.statusCode === 200) {
                setShoppingCart({
                    totalItems: res.data.totalItems,
                    totalPrices: res.data.totalPrices,
                    cartItems: res.data.cartItems
                })
            }
        } else {
            const sessionId = Cookies.get('sessionId');
            const res = await UpdateQuantityProductCartSession(sessionId, {
                cartItemId: cartItemId,
                quantity: +quantity
            });
            setShoppingCart(res.data.shoppingCart);
        }
    }

    return (
        <>
            <li className="product-cart d-flex list-group-item">
                <div className="product-cart-img">
                    <img src={product.imageUrl} alt="" />
                </div>
                <div className="product-cart-info">
                    <div className="product-cart-heading d-flex justify-content-between">
                        <div className="product-cart-name">
                            {product.name}
                        </div>
                        <button className='product-cart-remove'
                            onClick={() => setIsOpen(true)}>
                            <FontAwesomeIcon icon={faRectangleXmark} />
                        </button>
                    </div>
                    <div className="product-cart-other d-flex justify-content-between">
                        <div className="product-cart-quantity">
                            <input
                                type="number"
                                value={quantity}
                                min={1}
                                onChange={(e) => handleUpdateQuantity(cartItem.id, e.target.value)}
                            />
                        </div>
                        <div className="product-cart-price">
                            {product.currentPrice.toLocaleString()}
                        </div>
                    </div>
                </div>
            </li>
            {isOpen && <ModalConfirm
                setIsOpen={setIsOpen}
                name={cartItem.book.name}
                cartItemId={cartItem.id}
                handleRemoveProduct={handleRemoveProduct}
            />}
        </>
    )
};