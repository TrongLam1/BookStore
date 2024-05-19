import Abstract from './AbstractView.js'
import Comment from '../entities/Comment.js'
import Product from '../entities/Product.js'
import ShoppingCart from "../entities/ShoppingCart.js";
import Toast from './Toast.js'

const comment = new Comment();
const product = new Product();
const shoppingCart = new ShoppingCart();
const toast = new Toast();

const vietnamese = new Map([
    ["new", "Sách mới"],
    ["art", "Hội họa"],
    ["history", "Lịch sử"],
    ["dictionary", "Từ điển"],
    ["children", "Thiếu nhi"]
]);

export default class BookDetail extends Abstract {
    constructor(params) {
        super(params);
        this.setTitle("Book Detail");
    }

    renderProduct(item) {
        let save = item.price - item.salePrice;
        let body;
        if (save > 0) {
            body = `
            <div class="product-info-body">
                <div class="d-flex align-items-center">
                    <div class="product-info-sale-price">
                        ${item.salePrice.toLocaleString()}đ
                    </div>
                    <div class="product-info-price">${item.price.toLocaleString()}đ</div>
                    <div class="product-info-sale">-${item.sale}%</div>
                </div>
                <div class="save">( Tiết kiệm: <span>${save.toLocaleString()}đ</span> )</div>
            </div>
            `;
        } else {
            body = `
            <div class="product-info-body">
                <div class="d-flex align-items-center">
                    <div class="product-info-sale-price">
                        ${item.salePrice.toLocaleString()}đ
                    </div>
                </div>
            </div>
            `;
        }
        const product = `
            <div class="product-detail-section col-lg-9">
                <div class="product-info-wrap row">
                    <div class="product-info-img col-lg-5">
                        <img src="${item.image_url}" alt="">
                    </div>
                    <div class="product-info col-lg-7">
                        <div>
                            <div class="product-info-heading">
                                <div class="product-name">
                                    <h4>${item.name}</h4>
                                </div>
                                <div class="product-branch">
                                    Thương hiệu: ${item.branch}
                                </div>
                            </div>
                            ${body}
                            <div class="product-info-add-quantity d-flex align-items-center">
                                <span>Số lượng: </span>
                                <div class="d-flex">
                                    <button type="button" class="btn-left">
                                        <i class="fa-solid fa-minus"></i>
                                    </button>
                                    <input type="text" class="quantity" value="1">
                                    <button type="button" class="btn-right">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="product-btn-add-cart">
                                <button type="button" data-id=${item.id} class="btn btn_add_cart btn-cart add_to_cart">
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return product;
    }

    async getProductDetail() {
        const data = await product.getProductById(this.params.id);
        const description = data.description;
        const body = this.renderProduct(data);
        const direction = `
            <div class="direction-page d-flex">
                <a href="/">Trang chủ</a>/
                <a href="/category/${data.category}">${vietnamese.get(data.category) }</a>/
                <span>${data.name}</span>
            </div>
            `;
        return { body, direction, description };
    }

    async renderProductDetail() {
        try {
            const productDetail = await this.getProductDetail();
            return `
                ${productDetail.direction}
                <div class="product-detail-container row">
                    ${productDetail.body}
                </div>
                <div class="product-description-container">
                    <div class="product-description-heading">
                        <h5>GIỚI THIỆU</h5>
                    </div>
                    <div class="product-description-body">
                        <div class="description-content">
                            ${productDetail.description}
                        </div>
                    </div>
                </div>
                `;
        } catch (e) {
            console.log(e);
            return `
            <div class="product-detail-container row">
                <span>Không tìm thấy sản phẩm</span>
            </div>
            `;
        }
    }

    ratingProduct(number) {
        const solidStar = `<i class="fa-solid fa-star"></i>`;
        const regularStar = `<i class="fa-regular fa-star"></i>`;
        if (number === 5) {
            return solidStar.repeat(5);
        } else {
            const solidStars = solidStar.repeat(number);
            const regularStars = regularStar.repeat(5 - number);
            return `${solidStars}${regularStars}`;
        }
    }

    renderComment(item) {
        const rating = this.ratingProduct(item.rating);
        return `
        <div class="comment-item">
            <div class="comment-heading d-flex justify-content-between">
                <div class="d-flex align-items-center">
                    <span class="user">${item.user.userName}</span>
                    <span class="createdTime">${item.createdDate}</span>
                </div>
                <span class="comment-rating">
                    ${rating}
                </span>
            </div>
            <div class="comment-body">
                <span class="content">${item.content}</span>
            </div>
        </div>
        `;
    }

    async renderListComments() {
        try {
            const dataListComments = await comment.getListCommentsFromBook(this.params.id);
            //const averageRating = await comment.getAverageRating(this.params.id);
            const listComments = dataListComments.map(item => this.renderComment(item)).join('');
            const body = `
            <div class="product-comment-container col-lg-9">
                <div class="product-comment-heading d-flex justify-content-between align-items-center">
                    <span>ĐÁNH GIÁ - BÌNH LUẬN</span>
                    <button class="write-rating" type="button" data-bs-toggle="modal" data-bs-target="#RatingForm">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
                <div class="product-comment-body">
                    ${listComments}
                </div>
            </div>
            `;
            return body;
        } catch (e) {
            return "";
        }
    }

    renderModalRating() {
        return `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div class="myform">
                        <div class="card-body text-center">
                            <img src="/static/images/review.png" height="100" width="100">
                            <div class="comment-box text-center">
                                <h4>Đánh giá sản phẩm</h4>
                                <form>
                                    <div class="rating">
                                        <input type="radio" name="rating" value="5" id="5"><label for="5">☆</label>
                                        <input type="radio" name="rating" value="4" id="4"><label for="4">☆</label>
                                        <input type="radio" name="rating" value="3" id="3"><label for="3">☆</label>
                                        <input type="radio" name="rating" value="2" id="2"><label for="2">☆</label>
                                        <input type="radio" name="rating" value="1" id="1"><label for="1">☆</label>
                                    </div>
                                    <div class="comment-area">
                                        <textarea class="form-control" placeholder="Đánh giá của bạn về sản phẩm"
                                            rows="4"></textarea>
                                        <div class="err-mess"></div>
                                    </div>
                                    <div class="text-center mt-4">
                                        <button type="button" class="btn btn-success send px-5">
                                            Đánh giá
                                            <i class="fa fa-long-arrow-right ml-1"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    checkLogin() {
        let btnRating = document.querySelector(".write-rating");
        let modalRating = document.querySelector("#RatingForm");
        modalRating.innerHTML = this.renderModalRating();
        btnRating.addEventListener("click", () => { 
            if (!localStorage.getItem('user')) {
                alert("Vui lòng đăng nhập.");
                modalRating.querySelector(".btn-close").click();
            } else {
                modalRating.innerHTML = this.renderModalRating();
            }
        });
    }

    minusBook(item) {
        let quantity = parseInt(item.value);
        if (quantity > 2) {
            quantity = quantity - 1;
        } else {
            quantity = 1;
        }
        item.value = quantity;
    }

    plusBook(item) {
        let quantity = parseInt(item.value);
        quantity += 1;
        item.value = quantity;
    }

    async addToCartInBookDetail(id, quantity) {
        await shoppingCart.addBookToCart(id, quantity)
            .then(async () => {
                let cart = document.querySelector(".shopping-cart");
                cart.innerHTML = await shoppingCart.renderCartItemsListHeader();
                toast.showSuccessToast("Đã thêm sản phẩm vào giỏ hàng.");
            })
            .catch(() => {toast.showErrorToast("Thêm sản phẩm thất bại.")})
    }

    postComment(bookId) {
        let btn = document.querySelector(".send");
        let container = btn.parentNode.parentNode;
        let rating = container.getElementsByTagName("input");
        let commentArea = container.querySelector(".comment-area textarea");
        let ratingValue;

        btn.addEventListener("click", async () => {
            Array.from(rating).forEach(item => {
                if (item.checked) {
                    ratingValue = item.value;
                }
            });

            let commentRequest = {
                "content": commentArea.value,
                "rating": ratingValue
            }

            await comment.postCommentByUser(bookId, commentRequest);
        });
    }

    async getHtml() {
        const book = await this.renderProductDetail();
        const comments = await this.renderListComments();
        return `
        <div class="page-custom product-detail-page">
            ${book}
            ${comments}
        </div>
        `;
    }

    async funcForPage() {
        let container = document.querySelector(".product-info-add-quantity");
        let btnMinus = container.querySelector(".btn-left");
        let btnPlus = container.querySelector(".btn-right");
        let quantity = container.querySelector(".quantity");
        let btnAddBook = document.querySelector(".product-btn-add-cart button");

        this.checkLogin();

        if (btnMinus) {
            btnMinus.addEventListener("click", (e) => {
                e.preventDefault();
                this.minusBook(quantity);
            });
        }
        
        if (btnPlus) {
            btnPlus.addEventListener("click", (e) => {
                e.preventDefault();
                this.plusBook(quantity);
            });
        }

        if (btnAddBook) {
            btnAddBook.addEventListener("click", async () => {
                this.postComment(btnAddBook.getAttribute("data-id"));
                await this.addToCartInBookDetail(btnAddBook.getAttribute("data-id"), quantity.value);
            });
        }
    }
}
