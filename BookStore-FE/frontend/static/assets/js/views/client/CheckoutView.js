import Abstract from '../AbstractView.js';
import Order from '../../entities/Order.js';
import Toast from '../Toast.js';
import ShoppingCart from '../../entities/ShoppingCart.js';
import Coupon from '../../entities/CouponEntity.js';

const order = new Order();
const toast = new Toast();
const shopping = new ShoppingCart();
const coupon = new Coupon();

export default class Checkout extends Abstract {
    constructor(params) {
        super(params);
        this.setTitle('Thanh toán');
    }

    checkForm(form) {
        let input = form.querySelectorAll(".form-control");
        let invalid = form.querySelectorAll(".invalid-feedback");
        let payment = form.querySelectorAll(".paymentMethod");
        let paymentMethod;
        let countInvalid = 0;

        let request;

        if (input[0].value.length == 0) {
            invalid[0].style.display = 'block';
            countInvalid++;
        } else {
            invalid[0].style.display = 'none';
        }

        if (input[1].value.length < 10 || isNaN(input[1].value)) {
            invalid[1].style.display = 'block';
            countInvalid++;
        } else {
            invalid[1].style.display = 'none';
        }

        if (input[2].value.length == 0) {
            invalid[2].style.display = 'block';
            countInvalid++;
        } else {
            invalid[2].style.display = 'none';
        }

        payment.forEach(element => {
            if (element.checked) {
                paymentMethod = element.value;
            }
        });

        if (countInvalid == 0) {
            request = {
                username: input[0].value,
                phone: input[1].value,
                address: input[2].value,
                paymentMethod
            };

            return request;
        } else {
            return null;
        }
    }

    checkout() {
        let btnCheckout = document.querySelector(".btn-checkout");
        let form = document.querySelector(".needs-validation");

        btnCheckout.addEventListener("click", async (e) => {
            e.preventDefault();
            const request = this.checkForm(form);
            let parentNode = document.querySelector(".woocommerce-shipping-totals.shipping");
            let coupon = parentNode.querySelector(".sale-coupon").textContent;
            let valueCoupon = parseInt(coupon.replace(",", ""));
            if (request !== null) {
                if (request.paymentMethod === "ship-cod") {
                    await order.placeOrder(request, valueCoupon)
                        .then((response) => {
                            if (response.status === 201) {
                                toast.showSuccessToast("Đặt hàng thành công.")
                                setTimeout(() => {
                                    window.location.href = "/profile";
                                }, 1700);
                            } else {
                                let arrayString = response.message.split(":");
                                let errMessage = arrayString[1].trim();
                                toast.showErrorToast(errMessage);
                                setTimeout(() => {
                                    window.location.href = "/shopping-cart";
                                }, 1700);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            alert(err);
                        })
                } else {
                    await order.placeOrder(request, valueCoupon)
                        .then(data => {
                            return order.createPaymentVnPay(data.data);
                        })
                        .then(paymentData => {
                            console.log(paymentData);
                        })
                        .catch(error => {
                            console.error('An error occurred:', error);
                        });
                }
            } else {
                throw new Error("Thông tin không hợp lệ!");
            }
        });
    }

    checkCoupon() {
        let btn = document.querySelector(".btn-apply-coupon");
        let couponValue = document.querySelector(".coupon-apply");
        let orderTotal = document.querySelector(".order-total");
        let totalPrice = orderTotal.querySelector(".woocommerce-Price-amount");
        let totalPriceText = totalPrice.textContent;
        let totalPriceValue = parseFloat(totalPriceText.replace(",", ""));
        if (btn) {
            btn.addEventListener("click", async () => {
                if (couponValue.value !== "") {
                    totalPriceText = totalPriceText.replace(/,|đ/g, "");
                    let num = parseFloat(totalPrice);
                    const response = await coupon.checkUseCoupon(couponValue.value, num);
                    if (response.status === 200) {
                        let sale = response.data;
                        document.querySelector(".woocommerce-Price-amount.sale-coupon").innerHTML =
                            sale.toLocaleString();
                        totalPriceValue = totalPriceValue - sale;
                        totalPrice.innerHTML = totalPriceValue.toLocaleString();
                        toast.showSuccessToast("Áp dụng thành công.");
                    } else {
                        let err = response.message;
                        let parts = err.split(":");
                        let mess = parts[2].trim();
                        toast.showErrorToast(mess);
                    }
                }
            });
        }
    }

    renderItemView(data) {
        let book = data.book;
        return `
        <tr class="cart_item st-item-meta">
            <td class="product-name">
                ${book.name}&nbsp;
                <strong class="product-quantity">×${data.quantity}</strong>
            </td>
            <td class="product-total">
                <span class="woocommerce-Price-amount amount">${data.totalPrice.toLocaleString()}<span
                        class="woocommerce-Price-currencySymbol">₫</span></span>
            </td>
        </tr>
        `;
    }

    async renderListItemReview() {
        const response = await shopping.getCartItems();
        const data = response.status === 200 ? response.data : [];
        return data.map(item => this.renderItemView(item)).join('');
    }

    async renderTotalOrder() {
        const response = await shopping.getShoppingCart();
        const data = response.status === 200 ? response.data : [];
        return `
        <tr class="cart-subtotal">
            <th>Tạm tính</th>
            <td>
                <span class="woocommerce-Price-amount amount">${data.totalPrice.toLocaleString()}
                </span>
                <span class="woocommerce-Price-currencySymbol">₫</span>
            </td>
        </tr>
        <tr class="woocommerce-shipping-totals shipping">
            <th>Giảm giá</th>
            <td>
                <span class="woocommerce-Price-amount sale-coupon amount">0</span>
                <span class="woocommerce-Price-currencySymbol">₫</span>
            </td>
        </tr>
        <tr class="order-total">
            <th>Tổng</th>
            <td>
            <strong>
                <span class="woocommerce-Price-amount amount">${data.totalPrice.toLocaleString()}
                </span>
                <span class="woocommerce-Price-currencySymbol">₫</span>
            </strong>
            </td>
        </tr>
        `;
    }

    async getHtml() {
        let list = await this.renderListItemReview();
        let total = await this.renderTotalOrder();
        return `
        <div class="page-custom container">
            <div class="check-out-page row">
                <div class="info-order row col-lg-7">
                    <div class="order-md-1 checkout-form">
                        <h4 class="mb-3">Đặt hàng</h4>
                        <form class="needs-validation" novalidate>
                            <div class="row">
                                <div class="mb-3">
                                    <label for="fullname">Họ và tên</label>
                                    <input type="text" class="form-control" id="fullname" required>
                                    <div class="invalid-feedback">
                                        Vui lòng không để trống
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="phone">Số điện thoại</label>
                                <input type="phone" class="form-control" id="phone" minlength="10" maxlength="10">
                                <div class="invalid-feedback">
                                    Số điện thoại không hợp lệ
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="address">Địa chỉ</label>
                                <input type="text" class="form-control" id="address" required>
                                <div class="invalid-feedback">
                                    Vui lòng không để trống
                                </div>
                            </div>

                            <hr class="mb-4">

                            <h4 class="mb-3">Thanh toán</h4>

                            <div class="d-block my-3">
                                <div class="custom-control custom-radio">
                                    <input class="paymentMethod" value="ship-cod" name="paymentMethod" type="radio"
                                        class="custom-control-input" checked required>
                                    <label class="custom-control-label" for="credit">Ship COD</label>
                                </div>
                                <div class="custom-control custom-radio">
                                    <input class="paymentMethod" value="vnpay" name="paymentMethod" type="radio"
                                        class="custom-control-input" required>
                                    <label class="custom-control-label" for="debit">VNPay</label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="row justify-content-center col-lg-5">
                    <div class="cart-order-details">
                        <div class="order-review-container">
                            <div class="order-review">
                                <h3 class="step-title"><span>Đơn hàng của bạn</span></h3>

                                <div id="order_review" class="woocommerce-checkout-review-order">
                                    <table class="shop_table woocommerce-checkout-review-order-table">
                                        <thead>
                                            <tr>
                                                <th class="product-name">Sản phẩm</th>
                                                <th class="product-total">Tổng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${list}
                                        </tbody>
                                        <tfoot>
                                            ${total}
                                        </tfoot>
                                    </table>
                                    <div class="cart-payment-container">
                                        <div class="cart-payment-body">
                                            <div class="cart-payment-coupon">
                                                <input type="text" class="coupon-apply" placeholder="Nhập Coupon">
                                                <button class="btn-apply-coupon" type="button">Áp dụng</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="payment" class="woocommerce-checkout-payment">
                                        <div class="form-row place-order">
                                            <div class="woocommerce-terms-and-conditions-wrapper">
                                                <div class="woocommerce-privacy-policy-text"></div>
                                            </div>
                                            <button class="btn-checkout btn btn-primary btn-lg btn-block" type="button">
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
        </div>
        `;
    }

    async funcForPage() {
        this.checkout();
        this.checkCoupon();
    }
}