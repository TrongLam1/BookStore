/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { PaymentBanking, PlaceOrder } from "@/app/api/orderApi";
import { useShoppingCart } from "@/provider/shoppingCartProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CartItemsReview from "../cartItem/cartItemReview";
import './checkOutPage.scss';
import CheckOutPageFooter from "./checkOutPageFooter";

export default function CheckOutPageComponent(props: any) {
    const router = useRouter();

    const { user } = props;
    const { shoppingCart } = useShoppingCart();
    const [userName, setUsername] = useState(user.username);
    const [phone, setPhone] = useState(user.phone);
    const [address, setAddress] = useState('');
    const [payment, setPayment] = useState('');
    const [couponValue, setCouponValue] = useState('');

    useEffect(() => {
        if (!user) router.push("/auth/login");
    }, [router]);

    const handlePlaceOrder = async () => {
        const validForm = checkValidForm();
        if (!validForm) return;

        const form: IRequestPlaceOrder = {
            username: userName,
            phone,
            address,
            paymentMethod: payment,
            couponValue: +couponValue
        };

        const res = await PlaceOrder(form);
        if (payment === 'BANKING') {
            const resPayment = await PaymentBanking(res?.data.id);
            if (+resPayment.statusCode === 201) {
                router.push(resPayment?.data);
            }
        }
    };

    const checkValidForm = () => {
        const form = document.querySelector(".needs-validation");
        const errorMessages: any = form?.querySelectorAll(".invalid-feedback");
        let validForm = true;

        if (userName === '' || userName === null) {
            errorMessages[0].style.display = 'block';
            validForm = false;
        } else {
            errorMessages[0].style.display = 'none';
            validForm = true;
        }

        if (phone === '' || phone === null || isNaN(phone) || phone.length !== 10) {
            errorMessages[1].style.display = 'block';
            validForm = false;
        } else {
            errorMessages[1].style.display = 'none';
            validForm = true;
        }

        if (address === '' || address === null) {
            errorMessages[2].style.display = 'block';
            validForm = false;
        } else {
            errorMessages[2].style.display = 'none';
            validForm = true;
        }

        if (payment === '' || payment === null) {
            errorMessages[3].style.display = 'block';
            validForm = false;
        } else {
            errorMessages[3].style.display = 'none';
            validForm = true;
        }

        return validForm;
    };

    return (
        <div className="check-out-page row">
            <div className="info-order row col-lg-7">
                <div className="order-md-1 checkout-form">
                    <h4 className="mb-3">Đặt hàng</h4>
                    <form className="needs-validation" noValidate>
                        <div className="row">
                            <div className="mb-3">
                                <label htmlFor="fullname">Họ và tên</label>
                                <input type="text"
                                    className="form-control"
                                    id="fullname"
                                    value={userName}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <div className="invalid-feedback">
                                    Vui lòng không để trống
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input type="phone"
                                className="form-control"
                                id="phone" maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <div className="invalid-feedback">
                                Số điện thoại không hợp lệ
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address">Địa chỉ</label>
                            <input type="text"
                                className="form-control" id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <div className="invalid-feedback">
                                Vui lòng không để trống
                            </div>
                        </div>

                        <hr className="mb-4" />

                        <h4 className="mb-3">Thanh toán</h4>

                        <div className="d-block my-3">
                            <div className="custom-control custom-radio">
                                <input
                                    className="paymentMethod custom-control-input"
                                    value="SHIP COD"
                                    name="paymentMethod" type="radio" readOnly
                                    onClick={(e) => setPayment(e.target.value)}
                                />
                                <label className="custom-control-label" htmlFor="credit">Ship COD</label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input
                                    className="paymentMethod custom-control-input" value="BANKING" name="paymentMethod" type="radio" readOnly
                                    onClick={(e) => setPayment(e.target.value)}
                                />
                                <label className="custom-control-label" htmlFor="debit">VNPay</label>
                            </div>
                            <div className="invalid-feedback">
                                Chọn phương thức thanh toán
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row justify-content-center col-lg-5">
                <div className="cart-order-details">
                    <div className="order-review-container">
                        <div className="order-review">
                            <h3 className="step-title"><span>Đơn hàng của bạn</span></h3>
                            <div id="order_review" className="woocommerce-checkout-review-order">
                                <table className="shop_table woocommerce-checkout-review-order-table">
                                    <thead>
                                        <tr>
                                            <th className="product-name">Sản phẩm</th>
                                            <th className="product-total">Tổng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shoppingCart?.cartItems &&
                                            shoppingCart?.cartItems.length > 0 &&
                                            shoppingCart?.cartItems.map((item, index: number) => {
                                                return (
                                                    <CartItemsReview key={`cart-item-${index}`}
                                                        item={item} />
                                                )
                                            })
                                        }
                                    </tbody>
                                    <tfoot>
                                        <CheckOutPageFooter
                                            totalPrices={shoppingCart?.totalPrices}
                                            couponValue={couponValue}
                                        />
                                    </tfoot>
                                </table>
                                <div className="cart-payment-container">
                                    <div className="cart-payment-body">
                                        <div className="cart-payment-coupon">
                                            <input type="text"
                                                className="coupon-apply"
                                                placeholder="Nhập Coupon"
                                                value={couponValue}
                                                onChange={(e) => setCouponValue(e.target.value)}
                                            />
                                            <button className="btn-apply-coupon" type="button">
                                                Áp dụng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div id="payment" className="woocommerce-checkout-payment">
                                    <div className="form-row place-order">
                                        <div className="woocommerce-terms-and-conditions-wrapper">
                                            <div className="woocommerce-privacy-policy-text"></div>
                                        </div>
                                        <button
                                            className="btn-checkout btn btn-primary btn-lg btn-block" type="button"
                                            onClick={(e) => handlePlaceOrder(e)}
                                        >
                                            Đặt hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}