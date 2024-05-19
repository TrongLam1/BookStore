import Abstract from './AbstractView.js';
import Admin from '../entities/Admin.js';
import Product from '../entities/Product.js'
import TableUser from './dashboard/TableUser.js'
import TableOrder from './dashboard/TableOrder.js';
import TableBook from './dashboard/TableBook.js';
import ChartView from './dashboard/Chart.js'
import Pagination from '../entities/Pagination.js'
import Toast from './Toast.js';

const admin = new Admin();
const product = new Product();
const chartView = new ChartView();
const tableUser = new TableUser();
const tableOrder = new TableOrder();
const tableBook = new TableBook();
const pagination = new Pagination();
const toast = new Toast();

export default class DashBoard extends Abstract {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
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
                                    <input type="number" class="form-control" id="book-price">
                                </div>
                                <div class="mb3 col-lg-4">
                                    <label for="book-inventory" class="form-label">Số lượng</label>
                                    <input type="number" class="form-control" id="book-inventory" value="1">
                                </div>
                                <div class="mb3 col-lg-4">
                                    <label for="book-sale" class="form-label">Giảm giá</label>
                                    <input type="number" class="form-control" id="book-sale">
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
        let btnsView = document.querySelectorAll("#view-book");
        btnsView.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                let id = btn.getAttribute("data-id");
                let bookData = await product.getProductById(id);
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
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/public', function (messageOutput) {
                console.log(messageOutput.body);
                toast.showNotificationNewOrder(JSON.parse(messageOutput.body));
            });
        });
    }

    async getHtml() {
        let dashboardContent = ``;
        if (localStorage.getItem("user") !== null) {
            let countOrders = await admin.countOrders();
            dashboardContent = `
            <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card border-left-primary shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                        Tổng doanh thu:</div>
                                                    <div id="totalEarn" class="h5 mb-0 font-weight-bold text-gray-800">${countOrders.Revenue.toLocaleString()}đ</div>
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
                                                    <div id="pendingOrder" class="h5 mb-0 font-weight-bold text-gray-800">${countOrders.Another}</div>
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
                                                    <div id="deliveredOrder" class="h5 mb-0 font-weight-bold text-gray-800">${countOrders.Delivered}</div>
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
                                                    <div id="canceledOrder" class="h5 mb-0 font-weight-bold text-gray-800">${countOrders.Cancel}</div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
            `;
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
                                <a href="#" class="sidebar-link">
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
                                                Đăng kí
                                            </button>
                                        </a>
                                    </li>
                                    <li class="sidebar-item">
                                        <a class="sidebar-link sidebar-link-custom">
                                            <button class="btn-dashboard" type="button">
                                                Quên mật khẩu
                                            </button>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li class="sidebar-item">
                                <a id="chart" class="sidebar-link collapsed">
                                    <i class="fa-solid fa-chart-simple pe-2"></i>
                                    Thống kê
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
                                <li class="nav-item dropdown">
                                    <a href="#" data-bs-toggle="dropdown" class="nav-icon pe-md-0">
                                        <img src="/static/images/profile.jpg" class="avatar img-fluid rounded" alt="">
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <a href="#" class="dropdown-item">Đăng xuất</a>
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
        modalAddBook.innerHTML = this.renderModalAddBook();
        modalDetailOrder.innerHTML = this.renderModalDetailOrder();
        modalUpdBook.innerHTML = this.renderModalUpdBook();
        this.btnRenderTableBooks();
        this.btnRenderTableOrders();
        this.btnRenderTableUsers();
        this.btnRenderChart();
        tableBook.formAddNewBook();
        await tableBook.generateCategories();
        tableBook.generateSelectTypesAndBranchesOfCategory();
        const sidebarToggle = document.querySelector("#sidebar-toggle");
        sidebarToggle.addEventListener("click", function () {
            document.querySelector("#sidebar").classList.toggle("collapsed");
        });

        this.connectedSocket();

        let content = document.querySelector(".content");
        let page = this.params.page;
        switch (this.params.table) {

            case "user":
                await tableUser.renderTableUsers(content, page)
                    .then((totalPages) => {
                        tableUser.searchUser()
                        pagination.createButtonPagination(totalPages, page);
                    });
                break;

            case "order":
                await tableOrder.renderTableOrders(content, page)
                    .then((totalPages) => {
                        this.tableOrderFunc();
                        pagination.createButtonPagination(totalPages, page);
                    });
                break;

            case "book":
                await tableBook.renderTableBooks(content, page)
                    .then((totalPages) => {
                        this.tableBookFunc();
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