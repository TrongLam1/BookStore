'use client'
import Image from "next/image"
import Link from "next/link"
import noCart from '@/assets/images/no-cart.png';
import CartItemComponent from "../cartItem/cartItemComponent";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import './shoppingCartComponent.scss';

export default function ShoppingCartComponent(props: any) {

    const router = useRouter();
    const { user, shoppingCart } = props;

    if (!user) { router.push("/auth/login") }

    return (
        <div className="shopping-cart-container row justify-content-evenly">
            <div className="shopping-cart-body col-lg-7">
                <div className="shopping-cart-heading">
                    <div>Giỏ hàng của bạn</div>
                    <div><strong>{shoppingCart.totalItems}</strong> sản phẩm</div>
                </div>
                <ul className="shopping-cart-list">
                    {shoppingCart.cartItems && shoppingCart.cartItems.length > 0 ? (
                        shoppingCart.cartItems.map((item, index: any) => {
                            return (
                                <CartItemComponent key={`cart-item-${index}`} item={item} />
                            )
                        })
                    ) : (
                        <div className="no-cart">
                            <Image src={noCart} alt="No items in cart" />
                            <h5>
                                Chưa có sản phẩm trong giỏ hàng.
                                <Link href='/home'>Thêm sản phẩm.</Link>
                            </h5>
                        </div>
                    )}
                </ul>
                <div className="back-home">
                    <Link href="/home"><FontAwesomeIcon icon={faHouse} /></Link>
                </div>
            </div>
            <div className="shopping-cart-payment col-lg-4">
                <div className="cart-payment-container">
                    <div className="cart-payment-heading">
                        <h5>Cộng giỏ hàng</h5>
                    </div>
                    <div className="cart-payment-body">
                        <div className="cart-payment-total">
                            Tổng: <strong>{shoppingCart.totalPrices.toLocaleString()}đ</strong>
                        </div>
                        <div className="cart-payment-btn">
                            <Link href='/check-out'
                                className="payment-process">Tiến hành thanh toán</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 