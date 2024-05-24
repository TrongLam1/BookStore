import General from '../General.js'
import AbstractView from '../AbstractView.js'
import Product from '../../entities/Product.js'
import ShoppingCart from '../../entities/ShoppingCart.js';
import Toast from '../Toast.js';

const general = new General();
const product = new Product();
const shoppingCart = new ShoppingCart();
const toast = new Toast();

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Home Page");
    }

    addBookToCart() {
        var addBookBtn = document.querySelectorAll(".add-book-btn");
        addBookBtn.forEach(item => {
            item.addEventListener("click", async (e) => {
                e.preventDefault();
                if (localStorage.getItem("user") !== null) {
                    await shoppingCart.addBookToCart(item.getAttribute("data-id"), 1)
                        .then(async () => {
                            var cart = document.querySelector(".shopping-cart");
                            const cartItems = await shoppingCart.renderCartItemsListHeader();
                            cart.innerHTML = cartItems;
                            toast.showSuccessToast("Đã thêm sản phẩm vào giỏ hàng.");
                        })
                        .catch(() => { toast.showErrorToast("Thêm sản phẩm thất bại.") })
                } else {
                    await shoppingCart.addBookToCartToCookie(item.getAttribute("data-id"), 1)
                        .then(async () => {
                            var cart = document.querySelector(".shopping-cart");
                            const cartItems = await shoppingCart.renderCartItemsListHeader();
                            cart.innerHTML = cartItems;
                            toast.showSuccessToast("Đã thêm sản phẩm vào giỏ hàng.");
                        })
                        .catch(() => { toast.showErrorToast("Thêm sản phẩm thất bại.") })
                }
            });
        });
    }

    async getHtml() {
        let dictionary = "Từ Điển Anh Việt";
        let child = "Sách Thiếu Nhi";
        const top5Products = await product.renderTop5Products();
        let img1 = "./static/images/banner/banner-thieunhi.webp";
        let img2 = "./static/images/banner/banner-tudien.webp";
        const top5ProductsByType = await product.renderTop5ProductsByType(dictionary, img2);
        const top5ProductsByType2 = await product.renderTop5ProductsByType(child, img1);
        return `
            <main>
                <div class="home-page">
                    ${general.createBanner()}
                    ${top5Products}
                    ${top5ProductsByType}
                    ${top5ProductsByType2}
                </div>
            </main>
        `;
    }

    async funcForPage() {
        this.addBookToCart();
    }
}
