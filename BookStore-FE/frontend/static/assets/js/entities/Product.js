export default class Product {
    async getProductById(id) {
        try {
            const url = `http://localhost:8080/api/v1/book/find-by-id?id=${id}`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (e) {
            throw new Error(e);
        }
    }

    renderProductCard(item) {
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
                        <a href="/book/${item.id}/1" class="book-img" data-link>
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
                                <button data-id="${item.id}" class="add-book-btn">
                                    <i class="fa-solid fa-circle-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    }

    generateListProducts(item) {
        return this.renderProductCard(item);
    }

    async renderTop5Products() {
        const response = await axios.get("http://localhost:8080/api/v1/book/get-top-5", {
            headers: { 'Content-Type': 'application/json' }
        });
        const data = response.data.status === 200 ? response.data.data.data : [];
        const productsList = data.map(item => this.generateListProducts(item));
        const results = productsList.join("");
        return `
            <section class="section-book-tag">
                <div class="container container-custom">
                    <div
                        class="title_module_main heading-bar e-tabs not-dqtab d-flex justify-content-between align-items-center flex-wrap">
                        <h4 class="heading-bar__title">
                            <a href="#" class="link">Top sách bán chạy</a>
                        </h4>
                        <h6 class="heading-bar__showall">
                            <a href="/category/all" class="link">Xem tất cả</a>
                        </h6>
                    </div>
                    <div class="container-book-cards row mx-sm-0">
                        ${results}
                    </div>
                </div>
            </section>
        `;
    }

    async renderTop5ProductsByType(type, img) {
        const response = await axios.get("http://localhost:8080/api/v1/book/get-top-5-by-type?type=" + type, {
            headers: { 'Content-Type': 'application/json' }
        });
        const data = response.data.status === 200 ? response.data.data.data : [];
        const productsList = data.map(this.generateListProducts.bind(this));
        const results = productsList.join("");
        return `
            <section>
                <div class="container container-custom">
                    <a href="/category/dictionary" class="banner-tag-img">
                        <img src="${img}" alt="Banner">
                    </a>
                    <div class="container-book-cards row mx-sm-0">
                        ${results}
                    </div>
                </div>
            </section>
        `;
    }

    async renderFindByNameContaining(name) {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/book/find-by-name?name=" + name, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = response.data;
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    async getTypesAndBranchesOfCategory(param) {
        try {
            const url = "http://localhost:8080/api/v1/book/get-types-branches-book-category?category=" + param.category;
            const response = await axios.get(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    async getAllTypesAndBranches() {
        try {
            const url = "http://localhost:8080/api/v1/book/get-all-types-branches-book";
            const response = await axios.get(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    async getTypesBranchesOfCategory(category) {
        try {
            const url =
                "http://localhost:8080/api/v1/book/get-types-branches-book-category?category=" + category;
            const response = await axios.get(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    async getAllTypesAndBranches() {
        try {
            const url = "http://localhost:8080/api/v1/book/get-all-types-branches-book";
            const response = await axios.get(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    async getAllCategories() {
        try {
            const url = "http://localhost:8080/api/v1/book/get-all-categories-book";
            const response = await axios.get(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    async getBooksByCategoryTypesBranches(params) {
        const defaultParams = {
            types: '',
            branches: '',
            sortBy: '',
            sortDirection: '',
            page: ''
        };

        // Merge default params with incoming params
        const mergedParams = { ...defaultParams, ...params };

        // Prepare URL based on category
        const categoryParam = mergedParams.category === 'all' ? '' : `&category=${mergedParams.category}`;

        let url;

        if (categoryParam !== "") {
            url = `http://localhost:8080/api/v1/book/get-books-by-category-types-branches?pageNo=${mergedParams.page}&types=${mergedParams.types}&branches=${mergedParams.branches}&sortBy=${mergedParams.sortBy}&sortDirection=${mergedParams.sortDirection}${categoryParam}`;
        } else {
            url = `http://localhost:8080/api/v1/book/get-books-by-types-branches?pageNo=${mergedParams.page}&types=${mergedParams.types}&branches=${mergedParams.branches}&sortBy=${mergedParams.sortBy}&sortDirection=${mergedParams.sortDirection}`;
        }

        try {
            const response = await axios.get(url);
            console.log(response);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getRandomsBookByCategory(category) {
        try {
            const url = `http://localhost:8080/api/v1/book/random-book/${category}`;
            const response = await axios.get(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
