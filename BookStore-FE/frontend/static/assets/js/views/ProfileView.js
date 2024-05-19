import AbstractView from "./AbstractView.js";
import Order from '../entities/Order.js'

const order = new Order();

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
        const response = await order.getHistoryOrdersFromUser(1);
        const data = response.data;
        const listOrders = data.map(item => this.renderHistoryOrder(item)).join('');
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
        `;
    }

    async renderUserInfo() {
        const data = await this.getProfile();
        let phone = this.maskPhoneNumber(data.phone);
        let email = this.maskEmail(data.email);
        let username = (data.userName === null) ? '' : data.userName;
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
                    <input class="content col-lg-8" readonly type="text" value="${phone}" minlength="10" maxlength="10">
                    <span class="error-message"></span>
                </div>
            </div>
            <div class="profile-update-btn">
                <button type="submit" id="update-info" class="btn btn-primary">
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

        if (input[1].value.length != 10 || isNaN(input[1].value)) {
            let errorMessage = input[1].parentNode.querySelector(".error-message");
            errorMessage.innerHTML = "Số điện thoại không hợp lệ."
        } else {
            let errorMessage = input[1].parentNode.querySelector(".error-message");
            errorMessage.innerHTML = "";
        }

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            btn.innerHTML = "Lưu thông tin";
            for (const item of input) {
                item.readOnly = false;
                item.style.borderBottom = "1px solid red";
            }
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                await this.updateInfoUser(input[0].value, input[1].value).then(() => {
                    window.location.reload();
                });
            });
        });
    }

    maskPhoneNumber(phoneNumber) {
        // Check if the input is valid
        if (typeof phoneNumber !== 'string' || phoneNumber.length !== 10) {
            return "Invalid phone number format";
        }

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
        btnUpdateInfo.onclick = () => {
            this.btnUpdateInfo(btnUpdateInfo);
        }
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
        });
    }
}