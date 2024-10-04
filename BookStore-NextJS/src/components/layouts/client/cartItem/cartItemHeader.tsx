/* eslint-disable @next/next/no-img-element */
'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './cartItemHeader.scss';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useShoppingCart } from '@/provider/shoppingCartProvider';
import { RemoveProductFromCart, UpdateQuantityProductCart } from '@/app/api/shoppingCartApi';
import ModalConfirm from '../../modal/modalConfirm';

export default function CartItemHeaderComponent(props: any) {

    const { cartItem } = props;
    const { setShoppingCart } = useShoppingCart();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [quantity, setQuantity] = useState(cartItem.quantity);

    const product: IBook = cartItem?.book;

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

        if (+res.statusCode === 200) {
            setShoppingCart({
                totalItems: res.data.totalItems,
                totalPrices: res.data.totalPrices,
                cartItems: res.data.cartItems
            })
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