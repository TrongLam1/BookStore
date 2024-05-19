import AbstractView from '../AbstractView.js'
import Product from '../../entities/Product.js'
import HomeView from './HomeView.js';

const product = new Product();
const home = new HomeView();

export default class SearchView extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Search Page");
    }

    renderItemSearchPage(item) {
        let saleHtml = "";
        if (item.sale > 0) {
            saleHtml = `
            <div class="sale-wrap">
                <div class="old-price">${item.price.toLocaleString()}</div>
                <div class="sale">-${item.sale}%</div>
            </div>
            `;
        }
        return `
            <div class="col-20 col-6 col-sm-4">
                <div class="book-card-wrap">
                    <div class="book-card">
                        <a href="/book/${item.id}/1" class="book-img">
                            <img src="${item.image_url}" alt="">
                        </a>
                        <a href="/book/${item.id}/1" class="book-name">
                            ${item.name}
                        </a>
                        <div class="wrap-book-info">
                            <div class="book-price">
                                <div class="sale-price">${item.salePrice.toLocaleString()}</div>
                                ${saleHtml}
                            </div>
                            <div class="add-book">
                                <button class="add-book-btn">
                                    <i class="fa-solid fa-circle-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async getHtml() {
        let name = this.params.name;
        try {
            const response = await product.renderFindByNameContaining(name);
            const data = response.status === 200 ? response.data.data : null;
            const productsList = data.map(item => this.renderItemSearchPage(item)).join('');
            return `
            <div class="page-custom">
                    <div class="heading-search-page">
                        <div class="heading-search">TÌM KIẾM</div>
                        <div class="heading-text">Có <strong> ${data.length} sản phẩm </strong> cho tìm kiếm</div>
                    </div>
                    <div class="body-search-page">
                        <div class="list-search-container d-flex">
                            <div class="container-book-cards row mx-sm-0">
                                ${productsList}
                            </div>
                        </div>
                    </div>
                </div>
        `;
        } catch (e) {
            return `
            <div class="page-custom">
                <div class="heading-search-page">
                    <div class="heading-search">TÌM KIẾM</div>
                    <div class="heading-text">Không tìm thấy sản phẩm</div>
                </div>
                <div class="body-search-page">
                    <div class="list-search-container d-flex">
                        <div class="container-book-cards row mx-sm-0">
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    }

    async funcForPage() {
        home.addBookToCart();
    }
}