import Abstract from '../AbstractView.js';
import Admin from '../../entities/Admin.js';
import Product from '../../entities/Product.js'
import TableUser from './TableUser.js'
import TableOrder from './TableOrder.js';
import TableBook from './TableBook.js';
import TableCoupon from './TableCoupon.js';
import ChartView from './Chart.js'
import Pagination from '../../entities/Pagination.js'
import Toast from '../Toast.js';
import AuthenticationEntity from '../../entities/AuthenticationEntity.js';

const admin = new Admin();
const product = new Product();
const chartView = new ChartView();
const tableUser = new TableUser();
const tableOrder = new TableOrder();
const tableBook = new TableBook();
const tableCoupon = new TableCoupon();
const pagination = new Pagination();
const toast = new Toast();
const authentication = new AuthenticationEntity();
localStorage.setItem("quantity-new-orders", 0);

export default class DashBoard extends Abstract {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
    }

    logoutAdmin() {
        let btn = document.querySelector("#logout-admin");
        btn.addEventListener("click", async () => {
            await authentication.logOut().then(() => {
                localStorage.removeItem("user");
                window.location.href = "http://localhost:3000";
            });
        });
    }

    renderModalAddBook() {
        return `
        <div class="modal-dialog modal-dialog-centered modal-new-book">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="myform form-new-book">
                        <div class="add-book-heading d-flex justify-content-between align-items-center">
                            <div>
                                <h5>Sản phẩm</h5>
                            </div>
                            <div class="btn-close-custom">
                                <button id="close-add" type="button" data-bs-dismiss="modal" aria-label="Close">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>
                        <div class="add-book-form">
                            <form class="row" method="POST">
                                <div class="mb3 col-lg-12">
                                    <label for="book-name" class="form-label">Tên sách</label>
                                    <input type="text" class="form-control" id="book-name">
                                </div>
                                <div class="mb3 col-lg-4 d-flex flex-column">
                                    <label for="book-category" class="form-label">Danh mục</label>
                                    <select name="book-category" id="book-category">
                                        <option value="">-- Chọn --</option>
                                    </select>
                                </div>
                                <div class="mb3 col-lg-4 d-flex flex-column">
                                    <label for="book-branch" class="form-label">Nhà xuất bản</label>
                                    <select name="book-branch" id="book-branch">
                                        <option value="">-- Chọn --</option>
                                        <option value="">Văn Lang</option>
                                        <option value="">Khác</option>
                                    </select>
                                </div>
                                <div class="mb3 col-lg-4 d-flex flex-column">
                                    <label for="book-type" class="form-label">Thể loại</label>
                                    <select name="book-type" id="book-type">
                                        <option value="">-- Chọn --</option>
                                        <option value="">Văn Lang</option>
                                        <option value="">Khác</option>
                                    </select>
                                </div>
                                <div class="mb3 col-lg-4">
                                    <label for="book-price" class="form-label">Giá</label>
                                    <input type="number" class="form-control" min="1000" id="book-price">
                                </div>
                                <div class="mb3 col-lg-4">
                                    <label for="book-inventory" class="form-label">Số lượng</label>
                                    <input type="number" class="form-control" min="0" id="book-inventory" value="1">
                                </div>
                                <div class="mb3 col-lg-4">
                                    <label for="book-sale" class="form-label">Giảm giá</label>
                                    <input type="number" class="form-control" min="0" id="book-sale">
                                </div>
                                <div class="mb3 col-lg-12">
                                    <div class="row">
                                        <div class="col-lg-6 d-flex justify-content-between">
                                            <div>
                                                <label for="book-img" class="form-label">Hình ảnh</label>
                                                <input type="file" accept="image/*" class="form-control" id="book-img">
                                            </div>
                                            <div id="preview"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb3 col-lg-12 d-flex flex-column">
                                    <label for="book-des" class="form-label">Mô tả</label>
                                    <textarea name="book-des" id="book-des" cols="40" rows="10"></textarea>
                                </div>
                                <div class="d-flex flex-row-reverse">
                                    <button id="btn-add-book" type="button">Lưu</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    renderModalUpdBook() {
        return `
        <div class="modal-dialog modal-dialog-centered modal-new-book">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="myform form-new-book">
                        <div class="add-book-heading d-flex justify-content-between align-items-center">
                            <div>
                                <h5>Sản phẩm</h5>
                            </div>
                            <div class="btn-close-custom">
                                <button id="close-add" type="button" data-bs-dismiss="modal" aria-label="Close">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>
                        <div class="add-book-form">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    renderModalDetailOrder() {
        return `
        <div class="modal-dialog modal-dialog-centered modal-detail-order">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="modal-heading d-flex justify-content-between align-items-center">
                        <h4>Chi tiết đơn hàng</h4>
                        <div class="btn-close-custom">
                            <button id="close-order" type="button" data-bs-dismiss="modal" aria-label="Close">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                    <div class="modal-body row">
                        <div class="col-lg-7 modal-order-detail-container"></div>
                        <div class="modal-info-user col-lg-5">
                            <div class="modal-info-user-container"></div>
                        </div>
                        <div class="modal-payment-status-change">
                            <span>Tình trạng đơn hàng:</span>
                            <select name="order-status" id="order-status">
                                <option value="Cancelled">Hủy</option>
                                <option value="Confirmed">Đã xác nhận</option>
                                <option value="Delivered">Hoàn thành</option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button class="save-modal-order-detail" type="button">Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    renderModalAddCoupon() {
        return `
        <div class="modal-dialog modal-dialog-centered modal-new-book">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="myform form-new-book">
                        <div class="add-book-heading d-flex justify-content-between align-items-center">
                            <div>
                                <h5>coupon</h5>
                            </div>
                            <div class="btn-close-custom">
                                <button id="close-add" type="button" data-bs-dismiss="modal" aria-label="Close">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>
                        <div class="add-coupon-form">
                            <form class="row" method="POST">
                                <div class="mb3 col-lg-12">
                                    <label for="coupon-name" class="form-label">Tên coupon</label>
                                    <input type="text" class="form-control" id="coupon-name">
                                </div>
                                <div class="mb3 col-lg-4">
                                    <label for="coupon-value" class="form-label">Giá trị coupon</label>
                                    <input type="number" class="form-control" id="coupon-value">
                                </div>
                                <div class="mb3 col-lg-4">
                                    <label for="coupon-quantity" class="form-label">Số lượng</label>
                                    <input type="number" class="form-control" id="coupon-quantity" value="1">
                                </div>
                                <div class="mb3 col-lg-4">
                                    <label for="coupon-condition" class="form-label">
                                        Áp dụng cho đơn hàng tối thiểu
                                    </label>
                                    <input type="number" class="form-control" id="coupon-condition">
                                </div>
                                <div class="startDate">
                                    <label for="expired-date" class="form-label">
                                        Ngày hết hạn
                                    </label>
                                    <input type="date" id="expired-date" class="form-control" placeholder="Select DateTime">
                                </div>
                                <div class="d-flex flex-row-reverse">
                                    <button id="btn-add-coupon" type="button">Lưu</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    renderModalUpdCoupon() {
        return `
        <div class="modal-dialog modal-dialog-centered modal-new-book">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="myform form-new-book">
                        <div class="add-book-heading d-flex justify-content-between align-items-center">
                            <div>
                                <h5>coupon</h5>
                            </div>
                            <div class="btn-close-custom">
                                <button id="close-add" type="button" data-bs-dismiss="modal" aria-label="Close">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>
                        <div class="add-coupon-form">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    btnRenderTableBooks() {
        let btn = document.querySelector("#tableBooks");
        let content = document.querySelector(".content");
        btn.addEventListener("click", async () => {
            await tableBook.renderTableBooks(content)
                .then((totalPages) => {
                    let url = window.location.pathname + "?table=book";
                    history.pushState("", "", url);
                    this.tableBookFunc();
                    pagination.createButtonPagination(totalPages);
                });
        });
    }

    tableBookFunc() {
        tableBook.searchBook();
        tableBook.checkImportExcel();
        tableBook.importExcel();
        tableBook.exportExcel();
        let btnsView = document.querySelectorAll("#view-book");
        btnsView.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                let id = btn.getAttribute("data-id");
                let bookData = await product.getProductById(id).then(response => {
                    return response.status === 200 ? response.data : response.message;
                });
                let form = document.querySelector("#ModalUpdBook").querySelector(".add-book-form");
                let bookDetail = await tableBook.getBookDetail(bookData);
                form.innerHTML = bookDetail;
                form.querySelector("#book-branch").value = bookData.branch;
                form.querySelector("#book-type").value = bookData.type;
                tableBook.formUpdateBook(form);
            });
        });
        let btnsRemove = document.querySelectorAll("#remove-book");
        btnsRemove.forEach(btn => {
            btn.addEventListener("click", () => {
                tableBook.showConfirmationPopup(async (confirmed) => {
                    if (confirmed) {
                        let id = btn.getAttribute("data-id");
                        await admin.removeBook(id);
                    }
                });
            });
        });
    }

    btnRenderTableOrders() {
        let btn = document.querySelector("#tableOrders");
        let content = document.querySelector(".content");
        btn.addEventListener("click", async () => {
            await tableOrder.renderTableOrders(content).then((totalPages) => {
                let url = window.location.pathname + "?table=order";
                history.pushState("", "", url);
                this.tableOrderFunc();
                pagination.createButtonPagination(totalPages);

                let btnNotYetOrders = document.querySelector("#not-delivered-order");
                let btnDeliveredOrders = document.querySelector("#delivered-order");

                btnNotYetOrders.addEventListener("click", async () => {
                    await tableOrder.renderTableOrdersStatus(content, "confirmed", 1).then(() => {
                        let url = window.location.href;
                        url = this.modifyURL(url, "confirmed");
                        history.pushState("", "", url);
                        window.location.reload();
                        // this.tableOrderFunc();
                        // pagination.createButtonPagination(totalPages);
                    });
                });

                btnDeliveredOrders.addEventListener("click", () => {
                    tableOrder.renderTableOrdersStatus(content, "delivered", 1).then(() => {
                        let url = window.location.href;
                        url = this.modifyURL(url, "delivered");
                        history.pushState("", "", url);
                        window.location.reload();
                        // this.tableOrderFunc();
                        // pagination.createButtonPagination(totalPages);
                    });
                });
            });
        });
    }

    tableOrderFunc() {
        tableOrder.searchOrder();
        let btns = document.querySelectorAll("#view-order");
        btns.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                await tableOrder.btnModalDetailOrder(btn).then(id => tableOrder.saveOrder(id));
            });
        });
    }

    btnRenderTableUsers() {
        let btn = document.querySelector("#tableUsers");
        let content = document.querySelector(".content");
        btn.addEventListener("click", async () => {
            await tableUser.renderTableUsers(content)
                .then((totalPages) => {
                    let url = window.location.pathname + "?table=user";
                    history.pushState("", "", url);
                    tableUser.searchUser();
                    pagination.createButtonPagination(totalPages);
                });
        });
    }

    funcTableUser(totalPages, page) {
        tableUser.searchUser();
        pagination.createButtonPagination(totalPages, page);

        let btnAdmin = document.querySelector('#role-admin');
        let btnUser = document.querySelector('#role-user');
        let btnLockedAcc = document.querySelectorAll("#btn-lock-acc");
        let modalCreateAdmin = document.querySelector("#ModalFormCreateAdmin");

        modalCreateAdmin.innerHTML = tableUser.modalFormCreateAdmin();
        tableUser.createAccAdmin(modalCreateAdmin);

        btnAdmin.addEventListener("click", () => {
            window.location.href = "http://localhost:3000/dashboard?table=user&role=ADMIN";
        });

        btnUser.addEventListener("click", () => {
            window.location.href = "http://localhost:3000/dashboard?table=user&role=USER";
        });

        btnLockedAcc.forEach(btn => {
            btn.addEventListener("click", async () => {
                let email = btn.getAttribute("data-id");
                let status = btn.getAttribute("data-status");
                let action = status === "false" ? "mở khóa" : "khóa";
                tableUser.showConfirmationPopup(async (confirmed) => {
                    if (confirmed) {
                        const response = await tableUser.btnLockedAcc(btn);
                        toast.showSuccessToast(response.message);
                        setTimeout(() => { window.location.reload(); }, 1200);
                    }
                }, email, action);
            });
        });
    }

    btnRenderTableCoupons() {
        let btn = document.querySelector("#tableCoupons");
        let content = document.querySelector(".content");
        btn.addEventListener("click", async () => {
            await tableCoupon.loadDataCoupons(content)
                .then((totalPages) => {
                    let url = window.location.pathname + "?table=coupon";
                    history.pushState("", "", url);
                    this.tableCouponsFunc();
                    pagination.createButtonPagination(totalPages);
                });
        });
    }

    tableCouponsFunc() {
        tableCoupon.searchCoupon();
        let btnsView = document.querySelectorAll("#view-coupon");
        let btnValidCoupon = document.querySelector("#coupon-valid");

        btnsView.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                let name = btn.getAttribute("data-id");
                let html = await tableCoupon.loadInfoCoupon(name);
                let form = document.querySelector("#ModalUpdCoupon").querySelector(".add-coupon-form");
                form.innerHTML = html;
                tableCoupon.submitFormUpdateCoupon(form);
            });
        });

        btnValidCoupon.addEventListener("click", async () => {
            let content = document.querySelector(".content");
            await tableCoupon.loadValidCoupons(content).then(() => this.tableCouponsFunc());
        });
    }

    btnRenderChart() {
        let btn = document.querySelector("#chart");
        let content = document.querySelector(".content");
        btn.addEventListener("click", () => {
            let render = chartView.renderChart();
            content.innerHTML = render;
            chartView.changeTabs();
        });
    }

    connectedSocket() {
        var socket = new SockJS('http://localhost:8080/api/v1/socket/ws');
        var stompClient = Stomp.over(socket);
        let quantityNewOrders = document.querySelector("#quantity-new-orders");
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/public', function (messageOutput) {
                localStorage.setItem('quantity-new-orders', parseInt(quantityNewOrders.value) + 1)
                quantityNewOrders.value = localStorage.getItem('quantity-new-orders');
                toast.showNotificationNewOrder(JSON.parse(messageOutput.body));
            });
        });
    }

    modifyURL(url, status) {
        if (url.includes("?")) {
            if (url.includes("status=")) {
                url = url.replace(/status=[^&]*/, `status=${status}`);
            } else {
                url = `${url}&status=${status}`;
            }
        } else {
            url = `${url}?table=order&status=${direction}`;
        }

        return url;
    }

    async renderAndModifyURL(content, status, page) {
        await tableOrder.renderTableOrdersStatus(content, status, page);
        let url = window.location.href;
        url = this.modifyURL(url, status);
        history.pushState("", "", url);
        window.location.reload();
    }

    redirectNewOrders() {
        let element = document.querySelector(".redirect-table-orders");
        let quantity = document.querySelector("#quantity-new-orders");
        element.addEventListener("click", () => {
            quantity.value = localStorage.getItem("quantity-new-orders");
            window.location.href = "http://localhost:3000/dashboard?table=order&status=confirmed";
        });
    }

    async getHtml() {
        let dashboardContent = ``;
        if (localStorage.getItem("user") !== null) {
            let countOrders = await admin.countOrders()
                .then(response => {
                    return response.status === 200 ? response.data : response.message;
                })
                .then(data => {
                    dashboardContent = `
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left-primary shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            Tổng doanh thu:</div>
                                        <div id="totalEarn" class="h5 mb-0 font-weight-bold text-gray-800">
                                            ${data.Revenue.toLocaleString()}đ</div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left-primary shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            Đơn hàng đang xử lí:</div>
                                        <div id="pendingOrder" class="h5 mb-0 font-weight-bold text-gray-800">${data.Another}</div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left-success shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                            Đơn hàng đã hoàn thành:</div>
                                        <div id="deliveredOrder" class="h5 mb-0 font-weight-bold text-gray-800">${data.Delivered}
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left-danger shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                            Đơn hàng đã bị hủy:</div>
                                        <div id="canceledOrder" class="h5 mb-0 font-weight-bold text-gray-800">${data.Cancel}</div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                })
                .catch(err => {
                    dashboardContent = `
                        <div div class="col-xl-3 col-md-6 mb-4" >
                            <div class="card border-left-primary shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                Tổng doanh thu:</div>
                                            <div id="totalEarn" class="h5 mb-0 font-weight-bold text-gray-800">0 đ</div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div >
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left-primary shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            Đơn hàng đang xử lí:</div>
                                        <div id="pendingOrder" class="h5 mb-0 font-weight-bold text-gray-800">0</div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left-success shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                            Đơn hàng đã hoàn thành:</div>
                                        <div id="deliveredOrder" class="h5 mb-0 font-weight-bold text-gray-800">0</div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left-danger shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                            Đơn hàng đã bị hủy:</div>
                                        <div id="canceledOrder" class="h5 mb-0 font-weight-bold text-gray-800">0</div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                });
        }
        return `
        <div class="dashboard-container">
            <div class="wrapper">
                <aside id="sidebar" class="js-sidebar">
                    <div class="h-100">
                        <div class="sidebar-logo">
                            <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/dashboard">
                                <div class="sidebar-brand-icon rotate-n-15">
                                    <i class="fas fa-laugh-wink"></i>
                                </div>
                                <div class="sidebar-brand-text mx-3">Admin Panel</div>
                            </a>
                        </div>
                        <ul class="sidebar-nav">
                            <li class="sidebar-item">
                                <a href="/dashboard" class="sidebar-link">
                                    <i class="fa-solid fa-list pe-2"></i>
                                    Dashboard
                                </a>
                            </li>
                            <li class="sidebar-item">
                                <a href="" class="sidebar-link collapsed" data-bs-target="#pages"
                                    data-bs-toggle="collapse" aria-expanded="false"><i
                                        class="fa-solid fa-file-lines pe-2"></i>
                                    Bảng
                                </a>
                                <ul id="pages" class="sidebar-dropdown list-unstyled collapse"
                                    data-bs-parent="#sidebar">
                                    <li class="sidebar-item">
                                        <a class="sidebar-link sidebar-link-custom">
                                            <button class="btn-dashboard" id="tableBooks" type="button">
                                                Sản phẩm
                                            </button>
                                        </a>
                                    </li>
                                    <li class="sidebar-item">
                                        <a class="sidebar-link sidebar-link-custom">
                                            <button class="btn-dashboard" id="tableOrders" type="button">
                                                Đơn hàng
                                            </button>
                                        </a>
                                    </li>
                                    <li class="sidebar-item">
                                        <a class="sidebar-link sidebar-link-custom">
                                            <button class="btn-dashboard" id="tableUsers" type="button">
                                                Khách hàng
                                            </button>
                                        </a>
                                    </li>
                                    <li class="sidebar-item">
                                        <a class="sidebar-link sidebar-link-custom">
                                            <button class="btn-dashboard" id="tableCoupons" type="button">
                                                Coupons
                                            </button>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li class="sidebar-item">
                                <a href="" class="sidebar-link collapsed" data-bs-target="#auth"
                                    data-bs-toggle="collapse" aria-expanded="false"><i
                                        class="fa-regular fa-user pe-2"></i>
                                    Xác thực
                                </a>
                                <ul id="auth" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                    <li class="sidebar-item">
                                        <a class="sidebar-link sidebar-link-custom">
                                            <button class="btn-dashboard" type="button" data-bs-toggle="modal"
                                        data-bs-target="#ModalFormSignIn">
                                                Đăng nhập
                                            </button>
                                        </a>
                                    </li>
                                    <li class="sidebar-item">
                                        <a class="sidebar-link sidebar-link-custom">
                                            <button class="btn-dashboard" type="button" data-bs-toggle="modal" data-bs-target="#ModalFormSignUp">
                                                Đăng kí tài khoản thường
                                            </button>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li class="sidebar-item">
                                <a id="chart" class="sidebar-link collapsed">
                                    <i class="fa-solid fa-chart-simple pe-2"></i>
                                    Thống kê doanh thu
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>
                <div class="main">
                    <nav class="navbar navbar-expand px-3 border-bottom">
                        <button class="btn" id="sidebar-toggle" type="button">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="navbar-collapse navbar">
                            <ul class="navbar-nav">
                                <li class="nav-item dropdown noti-new-orders">
                                    <div class="redirect-table-orders">
                                        <i class="fa-solid fa-bell"></i>
                                        Bạn có <input type="number" id="quantity-new-orders" value=${localStorage.getItem("quantity-new-orders")} disabled> đơn hàng mới.
                                    </div>
                                </li>
                                <li class="nav-item dropdown">
                                    <a data-bs-toggle="dropdown" class="nav-icon pe-md-0">
                                        <img src="/static/images/profile.jpg" class="avatar img-fluid rounded" alt="">
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <button id="logout-admin" type="button">
                                            <a class="dropdown-item">Đăng xuất</a>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <main class="content px-3 py-2">
                        <div class="container-fluid">
                            <div class="mb-3">
                                <h4>Admin Dashboard</h4>
                            </div>
                            <div class="row">
                                ${dashboardContent}
                            </div>
                        </div>
                    </main>
                    <footer class="footer">
                        <div class="copy-right">
                            &#9400 Thành phố Hồ Chí Minh, 2024
                        </div>
                    </footer>
                </div>
            </div>
        </div>
        `;
    }

    async funcForPage() {
        header.innerHTML = "";
        footer.innerHTML = "";
        let modalAddBook = document.querySelector("#ModalAddBook");
        let modalDetailOrder = document.querySelector("#ModalDetailOrder");
        let modalUpdBook = document.querySelector("#ModalUpdBook");
        let modalAddCoupon = document.querySelector("#ModalAddCoupon");
        let modalUpdCoupon = document.querySelector("#ModalUpdCoupon");
        modalAddBook.innerHTML = this.renderModalAddBook();
        modalDetailOrder.innerHTML = this.renderModalDetailOrder();
        modalUpdBook.innerHTML = this.renderModalUpdBook();
        modalAddCoupon.innerHTML = this.renderModalAddCoupon();
        modalUpdCoupon.innerHTML = this.renderModalUpdCoupon();
        this.redirectNewOrders();
        this.btnRenderTableBooks();
        this.btnRenderTableOrders();
        this.btnRenderTableUsers();
        this.btnRenderTableCoupons();
        this.btnRenderChart();
        tableBook.formAddNewBook();
        await tableBook.generateCategories();
        tableBook.generateSelectTypesAndBranchesOfCategory();
        tableCoupon.submitFormNewCoupon();
        const sidebarToggle = document.querySelector("#sidebar-toggle");
        sidebarToggle.addEventListener("click", function () {
            document.querySelector("#sidebar").classList.toggle("collapsed");
        });

        this.connectedSocket();
        this.logoutAdmin();

        let content = document.querySelector(".content");
        let page = this.params.page !== undefined ? this.params.page : 1;
        switch (this.params.table) {

            case "user":
                if (this.params.role !== undefined && this.params.role === "ADMIN") {
                    await tableUser.renderTableUsersByRole(content, page, "ADMIN")
                        .then(totalPages => {
                            this.funcTableUser(totalPages, page);
                        });
                } else if (this.params.role !== undefined && this.params.role === "USER") {
                    await tableUser.renderTableUsersByRole(content, page, "USER")
                        .then(totalPages => {
                            this.funcTableUser(totalPages, page);
                        });
                } else {
                    await tableUser.renderTableUsers(content, page)
                        .then(totalPages => {
                            this.funcTableUser(totalPages, page);
                        });
                }

                break;

            case "order":
                if (this.params.status !== undefined) {
                    await tableOrder.renderTableOrdersStatus(content, this.params.status, page)
                        .then((totalPages) => {
                            this.tableOrderFunc();
                            pagination.createButtonPagination(totalPages, page);
                        });
                } else {
                    await tableOrder.renderTableOrders(content, page)
                        .then((totalPages) => {
                            this.tableOrderFunc();
                            pagination.createButtonPagination(totalPages, page);
                        });
                }

                let btnNotYetOrders = document.querySelector("#not-delivered-order");
                let btnDeliveredOrders = document.querySelector("#delivered-order");

                btnNotYetOrders.addEventListener("click", async () => {
                    tableOrder.renderTableOrdersStatus(content, "delivered", 1).then(async () => {
                        await this.renderAndModifyURL(content, "confirmed", 1);
                    });
                });

                btnDeliveredOrders.addEventListener("click", () => {
                    tableOrder.renderTableOrdersStatus(content, "delivered", 1).then(async () => {
                        await this.renderAndModifyURL(content, "delivered", 1);
                    });
                });
                break;

            case "book":
                await tableBook.renderTableBooks(content, page)
                    .then((totalPages) => {
                        this.tableBookFunc();
                        pagination.createButtonPagination(totalPages, page);
                    });
                break;

            case "coupon":
                await tableCoupon.loadDataCoupons(content, page)
                    .then((totalPages) => {
                        this.tableCouponsFunc();
                        pagination.createButtonPagination(totalPages, page);
                    });
                break;

            case "chart":
                let render = chartView.renderChart();
                content.innerHTML = render;
                chartView.changeTabs();
                break;

            default:
                break;
        }
    }
}