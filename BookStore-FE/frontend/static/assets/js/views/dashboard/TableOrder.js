import Admin from '../../entities/Admin.js';
import Product from '../../entities/Product.js';
import Order from '../../entities/Order.js';

const admin = new Admin();
const product = new Product();
const order = new Order();

const vietnamese = new Map([
    ["Unpaid", "Chưa thanh toán"],
    ["Paid", "Đã thanh toán"],
    ["Cancelled", "Hủy"],
    ["Confirmed", "Đã xác nhận"],
    ["Delivered", "Hoàn thành"]
])

export default class TableOrder {
    renderInfoUser(item) {
        return `
        <div class="modal-info-user-heading">
            <h5><strong>Khách hàng</strong></h5>
        </div>
        <div class="modal-info-user-body">
            <div class="modal-info-user-item d-flex justify-content-between">
                <span>Họ và tên:</span>
                <span>${item.username}</span>
            </div>
            <div class="modal-info-user-item d-flex justify-content-between">
                <span>Địa chỉ:</span>
                <span>${item.address}</span>
            </div>
            <div class="modal-info-user-item d-flex justify-content-between">
                <span>Số điện thoại:</span>
                <span>${item.phone}</span>
            </div>
            <div class="modal-info-user-item d-flex justify-content-between">
                <span>Phương thức thanh toán:</span>
                <span>${item.paymentMethod}</span>
            </div>
            <div class="modal-info-user-item d-flex justify-content-between">
                <span>Tình trạng đơn hàng:</span>
                <span>${vietnamese.get(item.status)}</span>
            </div>
            <div class="modal-info-user-item d-flex justify-content-between">
                <strong>Tổng đơn hàng:</strong>
                <strong>${item.totalPricesOrder.toLocaleString()}đ</strong>
            </div>
        </div>
        `;
    }

    renderOrderItems(item) {
        const book = item.book;
        return `
        <div class="modal-order-detail">
            <div class="order-item d-flex justify-content-between">
                <div class="d-flex">
                    <div class="order-item-img">
                        <img src="${book.image_url}" alt="">
                    </div>
                    <div class="order-item-info">
                        <div class="item-name">${book.name}</div>
                        <div class="item-quantity">x${item.quantity}</div>
                    </div>
                </div>
                <div class="order-item-totalPrice">
                    <div class="item-total">${item.totalPrice.toLocaleString()}đ</div>
                </div>
            </div>
        </div>
        `;
    }

    renderListOrders(item) {
        return `
        <tr>
            <td>#${item.id}</td>
            <td>${item.username}</td>
            <td>${item.createdDate}</td>
            <td>${vietnamese.get(item.paymentStatus)}</td>
            <td>${vietnamese.get(item.status)}</td>
            <td>
                <button class="btn-table-dashboard" id="view-order" type="button" data-bs-toggle="modal"
                    data-bs-target="#ModalDetailOrder" data-id=${item.id}>
                    <i class="fa-solid fa-circle-info"></i>
                </button>
            </td>
        </tr>
        `;
    }

    async renderTableOrders(container, page) {
        const data = await admin.getAllOrders(page).then(response => {
            return response.status === 200 ? response.data : response.message;
        })
        const dataOrders = data.data;
        const listOrders = dataOrders.map(item => this.renderListOrders(item)).join('');
        let results = `
        <div class="container-fluid">
            <div class="nav-btn-search d-flex align-items-center search-dashboard">
                <input id="searchOrder" class="form-control" type="text" placeholder="Nhập mã đơn hàng ...">
                    <button id="searchIcon" class="btn text-dark" type="button">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
            </div>
            <div class="d-flex justify-content-end">
                <div class="btn-filter-status-order">
                    <button type="button" id="not-delivered-order">Đơn hàng chưa hoàn thành</button>
                </div>
                <div class="btn-filter-status-order">
                    <button type="button" id="delivered-order">Đơn hàng đã hoàn thành</button>
                </div>
            </div>
            <table class="table table-striped table-responsive table-dashboard">
                <thead class="heading-table">
                    <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Ngày đặt</th>
                        <th>Thanh toán</th>
                        <th>Trạng thái đơn hàng</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody class="body-table">
                    ${listOrders}
                </tbody>
            </table>
        </div>
        <div class="pagination"><ul></ul></div>
        `;
        container.innerHTML = results;
        localStorage.setItem('totalPages', data.totalPages);
        return data.totalPages;
    }

    async btnModalDetailOrder(item) {
        let id = item.getAttribute("data-id");
        const data = await admin.adminGetOrder(id)
            .then(res => {
                return res.status === 200 ? res.data : [];
            });
        let info = this.renderInfoUser(data);
        let btnSave = document.querySelector(".save-modal-order-detail");
        let listItems = data.orderItems.map(item => this.renderOrderItems(item)).join('');
        let containerItems = document.querySelector(".modal-order-detail-container");
        let containerInfo = document.querySelector(".modal-info-user-container");

        btnSave.setAttribute("data-id", id);
        containerItems.innerHTML = listItems;
        containerInfo.innerHTML = info;
        let orderStatus = document.querySelector("#order-status");
        orderStatus.value = data.status;
        if (orderStatus.value === "Delivered") {
            btnSave.setAttribute("disabled", "disabled");
        } else {
            btnSave.removeAttribute("disabled");
        }

        return id;
    }

    saveOrder(id) {
        let btn = document.querySelector(".save-modal-order-detail");
        let selectElement = document.getElementById("order-status");
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            await admin.changeOrderStatus(id, selectElement.value);
        });
    }

    searchOrder() {
        let search = document.querySelector("#searchOrder");
        let body = document.querySelector(".body-table");
        search.addEventListener("keydown", async (e) => {
            if (e.keyCode == 13) {
                await order.getOrderById(search.value)
                    .then(response => {
                        let data = response.data;
                        let item = this.renderListOrders(data);
                        body.innerHTML = item;
                        let btn = document.querySelector("#view-order");
                        btn.addEventListener("click", async (e) => {
                            e.preventDefault();
                            await this.btnModalDetailOrder(btn).then(id => this.saveOrder(id));
                        });
                        document.querySelector(".pagination").innerHTML = "";
                    })
                    .catch(error => {
                        body.innerHTML = "Không tìm thấy đơn hàng.";
                        document.querySelector(".pagination").innerHTML = "";
                    });
            }
        });
    }

    async renderTableOrdersStatus(container, status, page) {
        const data = await admin.getOrdersByStatus(status, page).then(response => {
            return response.data;
        });
        const response = data.data;
        const listOrders = response.map(item => this.renderListOrders(item)).join('');
        let results = `
        <div class="container-fluid">
            <div class="nav-btn-search d-flex align-items-center search-dashboard">
                <input id="searchOrder" class="form-control" type="text" placeholder="Nhập mã đơn hàng ...">
                    <button id="searchIcon" class="btn text-dark" type="button">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
            </div>
            <div class="d-flex justify-content-end">
                <div class="btn-filter-status-order">
                    <button type="button" id="not-delivered-order">Đơn hàng chưa hoàn thành</button>
                </div>
                <div class="btn-filter-status-order">
                    <button type="button" id="delivered-order">Đơn hàng đã hoàn thành</button>
                </div>
            </div>
            <table class="table table-striped table-responsive table-dashboard">
                <thead class="heading-table">
                    <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Ngày đặt</th>
                        <th>Thanh toán</th>
                        <th>Trạng thái đơn hàng</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody class="body-table">
                    ${listOrders}
                </tbody>
            </table>
        </div>
        <div class="pagination"><ul></ul></div>
        `;
        container.innerHTML = results;
        return data.totalPages;
    }
}