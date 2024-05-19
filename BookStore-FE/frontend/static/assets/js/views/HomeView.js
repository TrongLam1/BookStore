import General from './General.js'
import AbstractView from './AbstractView.js'
import Product from '../entities/Product.js'
import ShoppingCart from '../entities/ShoppingCart.js';
import Toast from './Toast.js';

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
                await shoppingCart.addBookToCart(item.getAttribute("data-id"), 1)
                    .then(async () => {
                        toast.showSuccessToast("Đã thêm sản phẩm vào giỏ hàng.");
                    })
                    .catch(() => { toast.showErrorToast("Thêm sản phẩm thất bại.") })
            });
        });
    }

    async getHtml() {
        let book = "book";
        const top5Products = await product.renderTop5Products();
        const top5ProductsByType = await product.renderTop5ProductsByType(book);
        return `
            <main>
                <div class="home-page">
                    ${general.createBanner()}
                    ${top5Products}
                    ${top5ProductsByType}
                    ${top5ProductsByType}
                </div>
            </main>
        `;
    }

    async funcForPage() {
        this.addBookToCart();
    }
}
