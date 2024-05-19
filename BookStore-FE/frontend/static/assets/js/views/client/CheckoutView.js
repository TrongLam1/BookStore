import Abstract from '../AbstractView.js';
import Order from '../../entities/Order.js';
import Toast from '../Toast.js';

const order = new Order();
const toast = new Toast();

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

        let coupon = "";
        let valueCoupon = "";

        if (localStorage.getItem("sale-coupon") !== null) {
            coupon = JSON.parse(localStorage.getItem("sale-coupon")).coupon;
            valueCoupon = JSON.parse(localStorage.getItem("sale-coupon")).value;
        }

        console.log(coupon);

        btnCheckout.addEventListener("click", async (e) => {
            e.preventDefault();
            const request = this.checkForm(form);
            if (request !== null) {
                if (request.paymentMethod === "ship-cod") {
                    await order.placeOrder(request, coupon, valueCoupon)
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
                    await order.placeOrder(request, coupon, valueCoupon)
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

    getHtml() {
        return `
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 order-md-1 bg-white checkout-form">
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
                                <input class="paymentMethod" value="ship-cod" name="paymentMethod" type="radio" class="custom-control-input"
                                    checked required>
                                <label class="custom-control-label" for="credit">Ship COD</label>
                            </div>
                            <div class="custom-control custom-radio">
                                <input class="paymentMethod" value="vnpay" name="paymentMethod" type="radio" class="custom-control-input"
                                    required>
                                <label class="custom-control-label" for="debit">VNPay</label>
                            </div>
                        </div>

                        <hr class="mb-4">

                        <button class="btn-checkout btn btn-primary btn-lg btn-block" type="button">
                            Đặt hàng
                        </button>
                    </form>
                </div>
            </div>
        </div>
        `;
    }

    async funcForPage() {
        this.checkout();
    }
}