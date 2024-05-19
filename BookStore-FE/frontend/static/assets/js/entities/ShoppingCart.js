export default class ShoppingCart {
    async addBookToCart(productId, quantity) {
        const url = `http://localhost:8080/api/v1/shopping-cart/add-book/${productId}/${quantity}`;
        const token = JSON.parse(localStorage.getItem('user')).token;
        try {
            const response = await axios.post(url, {}, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error adding book to cart:", error);
            throw error;
        }
    };

    async getShoppingCart() {
        const url = "http://localhost:8080/api/v1/shopping-cart/get-cart";
        const token = JSON.parse(localStorage.getItem('user')).token;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error adding book to cart:", error);
            throw error;
        }
    };

    async getCartItems() {
        const url = "http://localhost:8080/api/v1/shopping-cart/get-cart-items";
        const token = JSON.parse(localStorage.getItem('user')).token;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error adding book to cart:", error);
            throw error;
        }
    };

    async removeCartItem(productId) {
        const url = `http://localhost:8080/api/v1/shopping-cart/remove-book/${productId}`;
        const token = JSON.parse(localStorage.getItem('user')).token;
        try {
            const response = await axios.delete(url, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error adding book to cart:", error);
            throw error;
        }
    };

    async updateQuantityBook(productId, quantity) {
        const url = `http://localhost:8080/api/v1/shopping-cart/update-quantity/${productId}/${quantity}`;
        const token = JSON.parse(localStorage.getItem('user')).token;
        try {
            const response = await axios.put(url, {}, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error adding book to cart:", error);
            throw error;
        }
    };

    renderCartItem(item) {
        let book = item.book;
        const bookId = book.id;

        const button = document.createElement('button');
        button.setAttribute('data-id', bookId);
        button.classList.add('product-cart-remove');

        const icon = document.createElement('i');
        icon.classList.add('fa-regular', 'fa-rectangle-xmark');
        button.appendChild(icon);

        const buttonContainer = document.createElement('div');
        buttonContainer.appendChild(button);

        return `
        <li class="product-cart d-flex list-group-item">
            <div class="product-cart-img">
                <img src="${book.image_url}" alt="">
            </div>
            <div class="product-cart-info">
                <div class="product-cart-heading d-flex justify-content-between">
                    <div class="product-cart-name">${book.name}</div>
                    ${buttonContainer.innerHTML}
                </div>
                <div class="product-cart-other d-flex justify-content-between">
                    <div class="product-cart-quantity">
                        <input type="number" data-id="${book.id}" value="${item.quantity}">
                    </div>
                    <div class="product-cart-price">
                        ${book.salePrice.toLocaleString()}
                    </div>
                </div>
            </div>
        </li>
        `;
    };

    async renderCartItemsListHeader() {
        const responseCartItems = await this.getCartItems();
        const shoppingCart = await this.getShoppingCart().then(response => {
            let shoppingCart = response.status === 200 ? response.data : [];
            return shoppingCart;
        });
        let results = "";
        if (shoppingCart.totalItems === 0 || shoppingCart.length === 0) {
            results = `
            <button type="button" class="dropdown-cart dropdown-toggle" data-bs-toggle="dropdown">
                <i class="shopping-cart-icon fa-solid fa-cart-shopping"></i>
                <span>Giỏ hàng</span>
            </button>
            <div class="dropdown-menu dropdown-menu-end list-products-cart" style="top: 220%">
                <div class="list-cart-container">
                    <div class="caret-up"><i class="fa-solid fa-caret-up"></i></div>
                    <h5 class="heading-cart">Giỏ hàng</h5>
                    <div class="no-cart">
                        <img src="./static/images/no-cart.png" alt="">
                        <h5>Chưa có sản phẩm trong giỏ hàng</h5>
                    </div>
                </div>
            </div>
            `;
        } else {
            const data = responseCartItems.status === 200 ? responseCartItems.data : [];
            const container = data.map(item => this.renderCartItem(item)).join('');
            results = `
            <button type="button" class="dropdown-cart dropdown-toggle" data-bs-toggle="dropdown">
                <i class="shopping-cart-icon fa-solid fa-cart-shopping"></i>
                <div class="shopping-cart-quantity">${shoppingCart.totalItems}</div>
                <span>Giỏ hàng</span>
            </button>
            <div class="dropdown-menu dropdown-menu-end list-products-cart" style="top: 220%">
                <div class="list-cart-container">
                    <div class="caret-up"><i class="fa-solid fa-caret-up"></i></div>
                    <h5 class="heading-cart">Giỏ hàng</h5>
                    <ul class="list-products-cart-wrap list-group list-group-flush">
                        ${container}
                    </ul>
                    <div class="footer-shopping-cart">
                        <div class="total-price d-flex justify-content-between">
                            <div class="total-price-text">TỔNG TIỀN:</div>
                            <div class="total-price-number">${shoppingCart.totalPrice.toLocaleString()}đ</div>
                        </div>
                        <div class="show-shopping-cart">
                            <a href="/shopping-cart">XEM GIỎ HÀNG</a>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        return results;
    };

    renderShoppingCartItem(data) {
        const item = data.book;
        return `
        <li class="shopping-cart-item d-flex justify-content-between">
            <div class="d-flex">
                <div class="cart-item-remove">
                    <button data-id="${item.id}" type="button">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="cart-item-img">
                    <img src="${item.image_url}" alt="">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.salePrice.toLocaleString()}đ</div>
                </div>
            </div>
            <div class="subtotal">
                <div class="cart-item-subtotal">${data.totalPrice.toLocaleString()}đ</div>
                <div class="cart-item-quantity">
                    <div class="cart-item-quantity">
                        <input type="number" data-id="${item.id}" value="${data.quantity}">
                    </div>
                </div>
            </div>
        </li>
        `;
    }

    async renderShoppingCartItemsList() {
        const data = await this.getCartItems().then(response => {
            return response.status === 200 ? response.data : response.message;
        });
        const itemsList = data.map(item => this.renderShoppingCartItem(item)).join('');
        return itemsList;
    }

    showConfirmationPopup(callback) {
        const confirmed = confirm("Bạn xác nhận muốn xóa sản phẩm ?");
        callback(confirmed);
    }

    btnRemoveProduct(elements) {
        elements.forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                this.showConfirmationPopup(async (confirmed) => {
                    if (confirmed) {
                        await this.removeProductFromCart(item).then(() => {
                            window.location.reload();
                        })
                    }
                });
            });
        });
    }

    async removeProductFromCart(item) {
        try {
            const id = item.getAttribute("data-id");
            await this.removeCartItem(id);
        } catch (e) {
            throw new Error(e);
        }
    }
}