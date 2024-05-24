import AbstractView from "../AbstractView.js";
import Order from '../../entities/Order.js';
import Pagination from '../../entities/Pagination.js';
import AuthenticationEntity from "../../entities/AuthenticationEntity.js";
import Toast from "../Toast.js";

const order = new Order();
const pagination = new Pagination();
const authentication = new AuthenticationEntity();
const toast = new Toast();

const vietnamese = new Map([
    ["Cancelled", "Đã hủy"],
    ["Confirmed", "Xác nhận đơn hàng"],
    ["Delivered", "Đã hoàn thành"]
]);

export default class ProfileView extends AbstractView {
    constructor(params) {
        super(params);
        this.title = "Profile";
    }

    async getProfile() {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await axios.get("http://localhost:8080/api/v1/user/profile", {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        const data = response.data;
        return data;
    }

    renderHistoryOrder(item) {
        return `
        <tr>
            <td>#${item.id}</td>
            <td>${item.address}</td>
            <td>${item.totalPricesOrder.toLocaleString()}đ</td>
            <td>${item.createdDate}</td>
            <td>${vietnamese.get(item.status)}</td>
            <td>
                <a href="/order-detail/${item.id}" id="btn-order-detail" class="btn btn-primary">
                    Xem
                </a>
            </td>
        </tr>
        `;
    }

    async renderListHistoryOrders() {
        let page = this.params.page !== undefined ? this.params.page : 1;
        const response = await order.getHistoryOrdersFromUser(page).then(response => {
            return response.status === 200 ? response.data : response.message;
        });
        localStorage.setItem("totalPages", response.totalPages);
        const data = response.data;
        const listOrders = data.map(item => this.renderHistoryOrder(item)).join('');
        let url = window.location.href;
        url = this.modifyUrl(url, page);
        history.pushState("", "", url);
        return `
        <div class="profile-content-header">
            Lịch sử mua hàng
        </div>
        <div class="profile-content-body">
            <div class="profile-body-title">Đơn đặt hàng</div>
            <div class="table-history-orders">
                <table class="table table-striped table-responsive">
                    <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Địa chỉ</th>
                            <th>Thành tiền</th>
                            <th>Ngày đặt</th>
                            <th>Trạng thái</th>
                            <th>Chi tiết đơn hàng</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${listOrders}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="pagination"><ul></ul></div>
        `;
    }

    async renderUserInfo() {
        const data = await this.getProfile().then(response => {
            return response.status === 200 ? response.data : response.message;
        });
        let phone = this.maskPhoneNumber(data.phone);
        let email = this.maskEmail(data.email);
        let username = (data.userName === null) ? '' : data.userName;
        history.pushState("", "", "http://localhost:3000/profile");
        return `
        <div class="profile-content-header">
            Thông tin tài khoản
        </div>
        <div class="profile-content-body">
            <div class="profile-body-title">Thông tin cơ bản</div>
            <div class="profile-body-container row">
                <div class="profile-body-item row">
                    <span class="col-lg-2">Họ và tên</span>
                    <input class="content col-lg-8" readonly type="text" value="${username}">
                </div>
                <div class="profile-body-item row">
                    <span class="col-lg-2">Email</span>
                    <input class="content-email col-lg-8" readonly type="text" value="${email}">
                </div>
                <div class="profile-body-item row">
                    <span class="col-lg-2">Số điện thoại</span>
                    <input class="content col-lg-8" readonly type="text" value="${phone}" maxlength="10">
                    <span class="error-message"></span>
                </div>
            </div>
            <div class="change-password d-flex align-items-center row">
                <div class="btn-change-password col-lg-2">
                    <button type="button" id="btn-change-pass" class="btn btn-primary">Đổi mật khẩu</button>
                </div>
                <div class="change-pass-container row profile-body-item align-items-center col-lg-10">
                    <div class="col-lg-10">
                        <div class="change-pass-input row">
                            <span class="col-lg-3">Mật khẩu hiện tại:</span>
                            <input type="password" class="content col-lg-7">
                            <span class="error-message"></span>
                        </div>
                        <div class="change-pass-input row">
                            <span class="col-lg-3">Mật khẩu mới:</span>
                            <input type="password" class="content col-lg-7">
                            <span class="error-message"></span>
                        </div>
                        <div class="change-pass-input row">
                            <span class="col-lg-3">Nhập lại mật khẩu mới:</span>
                            <input type="password" class="content col-lg-7">
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="col-lg-2">
                        <button type="submit" id="save-pass" class="btn btn-primary">
                            Lưu mật khẩu
                        </button>
                    </div>
                </div>
            </div>
            <div class="profile-update-btn">
                <button type="button" id="update-info" class="btn btn-primary">
                    Cập nhật thông tin
                </button>
            </div>
        </div>
        `;
    }

    async updateInfoUser(userName, phone) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await axios.post("http://localhost:8080/api/v1/user/update-info", {
            userName,
            phone
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }

    btnUpdateInfo(btn) {
        let container = document.querySelector(".profile-body-container");
        let input = container.querySelectorAll(".content");
        let btnCancelUpdate = document.querySelector("#cancel-update-info");
        btnCancelUpdate.style.display = "block";

        btn.innerHTML = "Lưu thông tin";
        for (const item of input) {
            item.readOnly = false;
            item.style.borderBottom = "1px solid red";
        }
        btn.addEventListener("click", async (e) => {
            if (input[1].value.length != 10 || isNaN(input[1].value)) {
                let errorMessage = input[1].parentNode.querySelector(".error-message");
                errorMessage.innerHTML = "Số điện thoại không hợp lệ."
            } else {
                let errorMessage = input[1].parentNode.querySelector(".error-message");
                errorMessage.innerHTML = "";

                await this.updateInfoUser(input[0].value, input[1].value).then(() => {
                    window.location.reload();
                });
            }
        });
    }

    maskPhoneNumber(phoneNumber) {
        if (phoneNumber !== null) {
            if (typeof phoneNumber !== 'string' || phoneNumber.length !== 10) {
                return "Invalid phone number format";
            }
        } else { return ""; }

        // Extract the first 3 characters
        var firstPart = phoneNumber.substring(0, 2);

        // Extract the last 2 characters
        var lastPart = phoneNumber.substring(8);

        // Mask the middle characters
        var maskedMiddle = phoneNumber.substring(3, 8).replace(/[0-9]/g, "*");

        // Concatenate the parts to form the masked phone number
        return firstPart + maskedMiddle + lastPart;
    }

    maskEmail(email) {
        // Find the position of the "@" symbol
        var atIndex = email.indexOf("@");

        var firstPart = email.substring(0, 2);

        var maskedMiddle = email.substring(2, atIndex).replace(/[^\s@]/g, "*");

        // Extract the domain part
        var domainPart = email.substring(atIndex);

        // Concatenate the parts to form the masked email
        return firstPart + maskedMiddle + domainPart;
    }

    modifyUrl(url, page) {
        if (url.includes("?")) {
            if (url.includes("page=")) {
                url = url.replace(/page=[^&]*/, `page=${page}`);
            } else {
                // Add sortBy to the URL
                url = `${url}&page=${page}`;
            }
        } else {
            // Add sortBy and sortDirection to the URL
            url = `${url}?history-orders=&page=${page}`;
        }

        return url;
    }

    btnChangePass() {
        let btn = document.querySelector("#btn-change-pass");
        btn.addEventListener("click", () => {
            let changePassContainer = document.querySelector(".change-pass-container");
            let btnUpdateProfile = document.querySelector(".profile-update-btn");
            console.log(btnUpdateProfile);
            changePassContainer.classList.toggle("active");
            btnUpdateProfile.classList.toggle("hidden");
            this.changePass();
        });
    }

    changePass() {
        let btn = document.querySelector("#save-pass");
        btn.addEventListener("click", async () => {
            let parent = btn.parentNode.parentNode;
            let changePassInputs = parent.querySelectorAll(".change-pass-input input");
            let errorMessage = parent.querySelectorAll(".error-message");
            let count = 0;

            if (changePassInputs[0].value.length < 8 || changePassInputs[0].value.length === 0) {
                errorMessage[0].innerHTML = "Mật khẩu phải từ 8 kí tự.";
                count++;
            } else {
                errorMessage[0].innerHTML = "";
            }

            if (changePassInputs[1].value.length < 8 || changePassInputs[1].value.length === 0) {
                errorMessage[1].innerHTML = "Mật khẩu phải từ 8 kí tự.";
                count++;
            } else {
                errorMessage[1].innerHTML = "";
            }

            if (changePassInputs[2].value !== changePassInputs[1].value) {
                errorMessage[2].innerHTML = "Nhập lại mật khẩu không đúng.";
                count++;
            } else {
                errorMessage[2].innerHTML = "";
            }

            if (count === 0) {
                let request = {
                    "oldPass": changePassInputs[0].value,
                    "newPass": changePassInputs[1].value
                }
                const response = await authentication.changePassword(request);
                if (response.status === 200) {
                    await authentication.logOut()
                        .then(() => {
                            toast.showSuccessToast("Đổi mật khẩu thành công.");
                            localStorage.removeItem("user");
                            setTimeout(() => { window.location.href = "http://localhost:3000"; }, 1300);
                        });
                } else {
                    toast.showErrorToast("Đổi mật khẩu không thành công.");
                }
            }
        });
    }

    async getHtml() {
        const userInfo = await this.renderUserInfo();
        return `
        <div class="page-custom">
            <div class="profile-user-container row d-flex justify-content-evenly">
                <div class="navbar-profile col-lg-2">
                    <div class="navbar-profile-header">Quản lí tài khoản</div>
                    <div class="navbar-profile-container">
                        <button type="button" class="profile-item personal active">Thông tin tài khoản</button>
                        <button type="button" class="profile-item orders">Lịch sử mua hàng</button>
                    </div>
                </div>
                <div class="profile-content-wrap col-lg-9">
                    ${userInfo}
                </div>
            </div>
        </div>
        `;
    }

    async funcForPage() {
        let btnUpdateInfo = document.querySelector("#update-info");
        btnUpdateInfo.addEventListener("click", () => {
            this.btnUpdateInfo(btnUpdateInfo);
        });

        this.btnChangePass();

        var btnPersonal = document.querySelector(".profile-item.personal");
        var btnHistoryOrders = document.querySelector(".profile-item.orders");
        var containerProfile = document.querySelector(".profile-content-wrap");

        btnPersonal.addEventListener("click", async () => {
            btnHistoryOrders.classList.remove("active");
            btnPersonal.classList.add("active");
            containerProfile.innerHTML = await this.renderUserInfo();
        });

        btnHistoryOrders.addEventListener("click", async () => {
            btnPersonal.classList.remove("active");
            btnHistoryOrders.classList.add("active");
            containerProfile.innerHTML = await this.renderListHistoryOrders();
            let totalPages = localStorage.getItem("totalPages");
            let page = this.params.page;
            if (totalPages > 1) {
                pagination.createButtonPagination(totalPages, page = 1);
            }
        });

        if (this.params.page !== undefined) {
            btnPersonal.classList.remove("active");
            btnHistoryOrders.classList.add("active");
            containerProfile.innerHTML = await this.renderListHistoryOrders();
            let totalPages = localStorage.getItem("totalPages");
            let page = this.params.page;
            if (totalPages > 1) {
                pagination.createButtonPagination(totalPages, page);
            }
        }
    }
}