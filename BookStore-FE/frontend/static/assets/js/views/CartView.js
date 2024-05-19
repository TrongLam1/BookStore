import Abstract from './AbstractView.js';
import ShoppingCart from '../entities/ShoppingCart.js';

const shoppingCart = new ShoppingCart();

export default class CartView extends Abstract {
    constructor(params) {
        super(params);
        this.setTitle("Shopping Cart");
    }

    async getHtml() {
        const list = await shoppingCart.renderShoppingCartItemsList();
        const getShoppingCart = await shoppingCart.getShoppingCart();
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
                                <div class="cart-payment-btn">
                                    <a href="/check-out" type="button" class="payment-process">Tiến hành thanh toán</a>
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
                                    <a href="#" type="button" class="payment-process">Tiến hành thanh toán</a>
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
        let btnsRemove = document.querySelectorAll(".cart-item-remove button");
        shoppingCart.btnRemoveProduct(btnsRemove);
    }   
}