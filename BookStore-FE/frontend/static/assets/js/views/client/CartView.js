import Abstract from '../AbstractView.js';
import ShoppingCart from '../../entities/ShoppingCart.js';
import Coupon from "../../entities/CouponEntity.js";
import Toast from "../Toast.js";

const shoppingCart = new ShoppingCart();
const coupon = new Coupon();
const toast = new Toast();

export default class CartView extends Abstract {
    constructor(params) {
        super(params);
        this.setTitle("Shopping Cart");
    }

    handlePayment() {
        const btnPayment = document.querySelector(".payment-process");
        const coupon = document.querySelector(".coupon-apply");
        btnPayment.addEventListener("click", () => {
            if (coupon.value === "") {
                localStorage.removeItem("sale-coupon");
            }
            window.location.href = "/check-out";
        });
    }

    checkCoupon() {
        let btn = document.querySelector(".btn-apply-coupon");
        let couponValue = document.querySelector(".coupon-apply");
        let totalPrice = document.querySelector(".cart-payment-total strong").textContent;
        btn.addEventListener("click", async () => {
            if (couponValue.value !== "") {
                totalPrice = totalPrice.replace(/,|đ/g, "");
                let num = parseFloat(totalPrice);
                const response = await coupon.checkUseCoupon(couponValue.value, num);
                if (response.status === 200) {
                    let sale = response.data;
                    document.querySelector("#sale-coupon").innerHTML = `${sale.toLocaleString()}đ`;
                    toast.showSuccessToast("Áp dụng thành công.");

                    let infoCoupon = {
                        "coupon": couponValue.value,
                        "value": sale
                    };

                    localStorage.setItem("sale-coupon", JSON.stringify(infoCoupon));
                } else {
                    let err = response.message;
                    let parts = err.split(":");
                    let mess = parts[2].trim();
                    toast.showErrorToast(mess);
                }
            }
        });
    }

    async getHtml() {
        const list = await shoppingCart.renderShoppingCartItemsList();
        const getShoppingCart = await shoppingCart.getShoppingCart().then(response => {
            return response.status === 200 ? response.data : response.message;
        });
        let result;
        if (getShoppingCart.totalItems > 0) {
            result = `
            <div class="page-custom">
                <div class="shopping-cart-container row justify-content-evenly">
                    <div class="shopping-cart-body col-lg-7">
                        <div class="shopping-cart-heading">
                            <div>Giỏ hàng của bạn</div>
                            <div><strong>${getShoppingCart.totalItems}</strong> sản phẩm</div>
                        </div>
                        <ul class="shopping-cart-list">
                            ${list}
                        </ul>
                        <div class="back-home">
                            <a href="/" type="button">
                                <i class="fa-solid fa-house"></i>
                            </a>
                            <button type="button" class="update-cart">
                                Cập nhật giỏ hàng
                            </button>
                        </div>
                    </div>
                    <div class="shopping-cart-payment col-lg-4">
                        <div class="cart-payment-container">
                            <div class="cart-payment-heading">
                                <h5>Cộng giỏ hàng</h5>
                            </div>
                            <div class="cart-payment-body">
                                <div class="cart-payment-total">
                                    Tổng: <strong>${getShoppingCart.totalPrice.toLocaleString()}đ</strong>
                                </div>
                                <div class="cart-payment-total">
                                    Giảm: <strong id="sale-coupon"></strong>
                                </div>
                                <div class="cart-payment-coupon">
                                    <input type="text" class="coupon-apply" placeholder="Nhập Coupon">
                                    <button class="btn-apply-coupon" type="button">Áp dụng</button>
                                </div>
                                <div class="cart-payment-btn">
                                    <button type="button" class="payment-process">
                                        Tiến hành thanh toán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        } else {
            result = `
            <div class="page-custom">
                <div class="shopping-cart-container row justify-content-evenly">
                    <div class="shopping-cart-body col-lg-7">
                        <div class="shopping-cart-heading">
                            <div>Giỏ hàng của bạn</div>
                            <div><strong>0</strong> sản phẩm</div>
                        </div>
                        <ul class="shopping-cart-list">
                            <div class="no-cart">
                                <img src="./static/images/no-cart.png" alt="">
                                <h5>Chưa có sản phẩm trong giỏ hàng. <a href="/">Thêm sản phẩm.</a></h5>
                            </div>
                        </ul>
                        <div class="back-home">
                            <a href="/" type="button">
                                <i class="fa-solid fa-house"></i>
                            </a>
                            <button type="button" class="update-cart">
                                Cập nhật giỏ hàng
                            </button>
                        </div>
                    </div>
                    <div class="shopping-cart-payment col-lg-4">
                        <div class="cart-payment-container">
                            <div class="cart-payment-heading">
                                <h5>Cộng giỏ hàng</h5>
                            </div>
                            <div class="cart-payment-body">
                                <div class="cart-payment-total">
                                    Tổng: <strong>0đ</strong>
                                </div>
                                <div class="cart-payment-btn">
                                    <button type="button" class="payment-process" disabled>
                                        Tiến hành thanh toán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }

        return result;
    }

    async funcForPage() {
        this.handlePayment();
        this.checkCoupon();
        let btnsRemove = document.querySelectorAll(".cart-item-remove button");
        shoppingCart.btnRemoveProduct(btnsRemove);
    }
}