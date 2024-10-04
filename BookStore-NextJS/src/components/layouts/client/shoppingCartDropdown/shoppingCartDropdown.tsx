'use client'
import noCart from '@/assets/images/no-cart.png';
import { useShoppingCart } from '@/provider/shoppingCartProvider';
import { faCaretUp, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { NavDropdown } from 'react-bootstrap';
import CartItemHeaderComponent from '../cartItem/cartItemHeader';
import './shoppingCartDropdown.scss';

const ShoppingCartDropdown = () => {

    const { shoppingCart } = useShoppingCart();

    useEffect(() => { }, [shoppingCart]);

    return (
        <>
            <NavDropdown autoClose='outside'
                title={
                    <>
                        <FontAwesomeIcon icon={faCartShopping} className='mx-2' />
                        <div className='shopping-cart-quantity'>
                            {shoppingCart?.totalItems ?? 0}
                        </div>
                        Giỏ hàng
                    </>
                }
                className='shopping-cart-container'>
                <NavDropdown.Item className='shopping-cart-item'>
                    <div className="list-cart-container">
                        <div className="caret-up">
                            <FontAwesomeIcon icon={faCaretUp} />
                        </div>
                        <h5 className="heading-cart">Giỏ hàng</h5>
                        <ul className="list-cart-items">
                            {shoppingCart?.cartItems &&
                                shoppingCart?.cartItems.length > 0 ?
                                (shoppingCart.cartItems.map((item, index: number) => {
                                    return (
                                        <CartItemHeaderComponent
                                            key={index}
                                            cartItem={item}
                                        />
                                    )
                                }))
                                :
                                (<div className="no-cart">
                                    <Image src={noCart} alt="No cart item" />
                                    <h5>Chưa có sản phẩm trong giỏ hàng</h5>
                                </div>)
                            }
                        </ul>
                    </div>
                </NavDropdown.Item>
                {+shoppingCart?.totalPrices > 0 &&
                    <div className="footer-shopping-cart">
                        <div className="total-price d-flex justify-content-between">
                            <div className="total-price-text">TỔNG TIỀN:</div>
                            <div className="total-price-number">
                                {shoppingCart?.totalPrices.toLocaleString()}đ
                            </div>
                        </div>
                        <div className="show-shopping-cart">
                            <Link href="/shopping-cart">XEM GIỎ HÀNG</Link>
                        </div>
                    </div>}
            </NavDropdown>
        </>
    );
};

export default ShoppingCartDropdown;