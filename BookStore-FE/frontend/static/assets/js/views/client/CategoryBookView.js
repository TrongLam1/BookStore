import Abstract from '../AbstractView.js';
import Product from '../../entities/Product.js'
import Pagination from '../../entities/Pagination.js'
import HomeView from './HomeView.js';

const product = new Product();
const pagination = new Pagination();
const home = new HomeView();

export default class TypeBookView extends Abstract {
    constructor(params) {
        super(params);
        this.setTitle("Type Book");
    }

    // ---------- Check box -----------------

    renderCheckBoxType(item) {
        return `
        <div class="form-check form-check-custom">
            <input type="checkbox" class="form-check-input" id="type" name="${item}" value="${item}">
            <label class="form-check-label" for="${item}">${item}</label>
        </div>
        `;
    }

    renderCheckBoxBranch(item) {
        return `
        <div class="form-check form-check-custom">
            <input type="checkbox" class="form-check-input" id="branch" name="${item}" value="${item}">
            <label class="form-check-label" for="${item}">${item}</label>
        </div>
        `;
    }

    renderListCheckBoxType(data) {
        const listCheckBox = data.map(item => this.renderCheckBoxType(item)).join('');
        return listCheckBox;
    }

    renderListCheckBoxBranch(data) {
        const listCheckBox = data.map(item => this.renderCheckBoxBranch(item)).join('');
        return listCheckBox;
    }

    async renderBookFilter() {
        let data;
        let response;
        if (this.params.category !== "all") {
            response = await product.getTypesBranchesOfCategory(this.params.category);
        } else {
            response = await product.getAllTypesAndBranches();
        }
        data = response.status === 200 ? response.data : new Error;
        const listTypes = this.renderListCheckBoxType(data[0]);
        const listBranches = this.renderListCheckBoxBranch(data[1]);
        return `
        <div class="btn-open-filter">
            <button id="btn-open-filter" type="button">
                <i class="fa-solid fa-bars-staggered"></i>
                Lọc sách
            </button>
        </div>
        <div class="types-book-filter-container col-lg-2">
            <div class="types-book-filter">
                <div class="btn-close-filter">
                    <button id="btn-close-filter" type="button">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="types-book-branch">
                    <div class="heading-branch">HÃNG SẢN XUẤT</div>
                    ${listBranches}
                </div>
                <div class="types-book-type">
                    <div class="heading-branch">THỂ LOẠI SÁCH</div>
                    ${listTypes}
                </div>
                <div class="types-book-btn">
                    <button type="button" id="filterBook" class="filter-book">Lọc</button>
                </div>
            </div>
        </div>
        `;
    }

    async filterBook(item) {
        const container = item.parentNode.parentNode;
        const checkTypes = container.querySelectorAll("#type");
        const checkBranches = container.querySelectorAll("#branch");
        const listType = new Array();
        const listBranch = new Array();

        checkTypes.forEach(checkBox => {
            if (checkBox.checked) {
                listType.push(checkBox.value);
            }
        });
        checkBranches.forEach(checkBox => {
            if (checkBox.checked) {
                listBranch.push(checkBox.value);
            }
        });

        localStorage.setItem("type", listType);
        localStorage.setItem("branch", listBranch);

        let url = window.location.href.split('?')[0];

        let params = [];
        if (listType.length > 0) {
            params.push(`types=${listType.join(',')}`);
        }
        if (listBranch.length > 0) {
            params.push(`branches=${listBranch.join(',')}`);
        }

        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        history.pushState("", "", url);

        window.location.reload();
    }

    setCheckedStateFromLocalStorage(key, selector) {
        const storedString = localStorage.getItem(key);
        if (storedString) {
            const myArray = storedString.split(',').map(item => item.trim());
            const checkboxes = document.querySelectorAll(selector);
            checkboxes.forEach(checkbox => {
                if (myArray.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
    }

    checkedBoxFromLocalStorage() {
        this.setCheckedStateFromLocalStorage('type', '#type');
        this.setCheckedStateFromLocalStorage('branch', '#branch');
    }

    // ------------------------- Books --------------------

    renderBookFilterItem(item) {
        let btnAdd;
        if (item.inventory === 0) {
            btnAdd = `
            <button class="add-book-btn" disabled>
                <i class="fa-solid fa-circle-plus"></i>
            </button>
            `;
        } else {
            btnAdd = `
            <button class="add-book-btn" data-id="${item.id}">
                <i class="fa-solid fa-circle-plus"></i>
            </button>
            `;
        }
        if (item.sale !== 0) {
            return `
            <div class="col-lg-3 col-6 col-sm-4">
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
                                <div class="sale-price">${item.salePrice.toLocaleString()}đ</div>
                                <div class="sale-wrap">
                                    <div class="old-price">${item.price.toLocaleString()}d</div>
                                    <div class="sale">-${item.sale}%</div>
                                </div>
                            </div>
                            <div class="add-book">
                                ${btnAdd}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        } else {
            return `
            <div class="col-lg-3 col-6 col-sm-4">
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
                                <div class="sale-price">${item.price.toLocaleString()}đ</div>
                            </div>
                            <div class="add-book">
                                ${btnAdd}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    }

    async renderBooksFilterList() {
        const response = await product.getBooksByCategoryTypesBranches(this.params);
        const data = response.status === 200 ? response.data : response.message;
        const totalPages = data.totalPages;
        localStorage.setItem("totalPagesCategory", totalPages);
        const listBooks = data.data.map(item => this.renderBookFilterItem(item)).join('');
        return listBooks;
    }

    async getHtml() {
        const bookFilter = await this.renderBookFilter();
        const listBooks = await this.renderBooksFilterList();
        return `
        <div class="page-custom">
            <div class="types-book-container row">
                ${bookFilter}
                <div class="types-book-list col-lg-10">
                    <div class="heading-types-list">
                        <div class="heading-types-header">
                            TẤT CẢ SẢN PHẨM
                        </div>
                        <div class="heading-types-sort">
                            <span>Sắp xếp:</span>
                            <span><button class="btn-sort" data-sort="name" data-direction="ASC" type="button">Tên A->Z</button></span>
                            <span><button class="btn-sort" data-sort="name" data-direction="DESC" type="button">Tên Z->A</button></span>
                            <span><button class="btn-sort" data-sort="salePrice" data-direction="ASC" type="button">Giá tăng dần</button></span>
                            <span><button class="btn-sort" data-sort="salePrice" data-direction="DESC" type="button">Giá giảm dần</button></span>
                        </div>
                    </div>
                    <div class="book-list-container">
                        <div class="container-book-cards row mx-sm-0">
                            ${listBooks}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pagination"><ul></ul></div>
        `;
    }

    sortBooksByNameASC() {
        let btn = document.querySelectorAll(".btn-sort");
        btn.forEach(item => {
            item.addEventListener("click", () => {
                let sortBy = item.getAttribute("data-sort");
                let direction = item.getAttribute("data-direction");
                this.sortBooks(sortBy, direction);
            })
        });
    }

    sortBooks(sortBy, direction) {
        let url = window.location.href;
        url = this.modifyURL(url, sortBy, direction);
        history.pushState("", "", url);
        window.location.reload();
    }

    modifyURL(url, sortBy, direction) {
        // Check if URL contains '?'
        if (url.includes("?")) {
            // Check if sortBy already exists in the URL
            if (url.includes("sortBy=")) {
                // Replace the value of sortBy
                url = url.replace(/sortBy=[^&]*/, `sortBy=${sortBy}`);
            } else {
                // Add sortBy to the URL
                url = `${url}&sortBy=${sortBy}`;
            }

            // Check if sortDirection already exists in the URL
            if (url.includes("sortDirection=")) {
                // Replace the value of sortDirection
                url = url.replace(/sortDirection=[^&]*/, `sortDirection=${direction}`);
            } else {
                // Add sortDirection to the URL
                url = `${url}&sortDirection=${direction}`;
            }
        } else {
            // Add sortBy and sortDirection to the URL
            url = `${url}?sortBy=${sortBy}&sortDirection=${direction}`;
        }

        return url;
    }

    filterBookMobile() {
        let openFilter = document.querySelector("#btn-open-filter");
        let closeFilter = document.querySelector("#btn-close-filter");
        openFilter.addEventListener("click", () => {
            let layout = document.querySelector(".types-book-filter-container");
            layout.style.display = "block";
        });

        closeFilter.addEventListener("click", () => {
            let layout = document.querySelector(".types-book-filter-container");
            layout.style.display = "none";
        });
    }

    async funcForPage() {
        var btnFilter = document.querySelector(".filter-book");
        btnFilter.addEventListener("click", (e) => {
            e.preventDefault();
            this.filterBook(btnFilter);
        });
        this.filterBookMobile();
        this.checkedBoxFromLocalStorage();
        this.sortBooksByNameASC();
        home.addBookToCart();
        let totalPages = localStorage.getItem("totalPagesCategory");
        let page = this.params.page;
        if (totalPages > 1) {
            pagination.createButtonPagination(totalPages, page);
        }
    }
}