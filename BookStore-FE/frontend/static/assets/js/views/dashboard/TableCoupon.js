import Admin from '../../entities/Admin.js';
import Coupon from '../../entities/CouponEntity.js';
import Toast from '../Toast.js';

const admin = new Admin();
const coupon = new Coupon();
const toast = new Toast();

export default class TableCoupon {
    renderCouponItem(item) {
        return `
        <tr>
            <td>#${item.id}</td>
            <td>${item.createdDate}</td>
            <td>${item.expiredDate}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.valueCoupon.toLocaleString()}đ</td>
            <td>${item.conditionCoupon.toLocaleString()}đ</td>
            <td>
                <button class="btn-table-dashboard" id="view-coupon" type="button" data-bs-toggle="modal" data-bs-target="#ModalUpdCoupon" data-id="${item.name}">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
            </td>
        </tr>
        `;
    }

    async loadDataCoupons(container, page = 1) {
        const response = await coupon.getAllCoupons(page);
        const data = response.status === 200 ? response.data : [];

        this.renderTableCoupons(data, container, page);

        return data.totalPages;
    }

    renderTableCoupons(data, container, page = 1) {
        const dataCoupons = data.data;
        let listCoupons = "";
        if (dataCoupons.length > 0) {
            listCoupons = dataCoupons.map(item => this.renderCouponItem(item)).join("");
        }

        let results = `
        <div class="container-fluid">
            <div class="container">
                <div class="nav-btn-search d-flex align-items-center search-dashboard">
                    <input id="searchCoupon" class="form-control" type="text" placeholder="Nhập tên coupon ...">
                    <button id="searchIcon" class="btn text-dark" type="button">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
                <div class="d-flex align-items-center">
                    <div class="new-coupon">
                        <button type="button" id="add-new-coupon" type="button" data-bs-toggle="modal" data-bs-target="#ModalAddCoupon">
                            <i class="fa-regular fa-square-plus"></i>
                        </button>
                    </div>
                    <div class="btn-filter-status-order">
                        <button type="button" id="coupon-valid">Coupon khả dụng</button>
                    </div>
                </div>
                <table class="table table-striped table-responsive table-dashboard">
                    <thead class="heading-table">
                        <tr>
                            <th>ID</th>
                            <th>Ngày tạo</th>
                            <th>Ngày hết hạn</th>
                            <th>Tên</th>
                            <th>Số lượng</th>
                            <th>Giá trị</th>
                            <th>Đơn hàng áp dụng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="body-table">
                        ${listCoupons}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="pagination"><ul></ul></div>
        `;
        container.innerHTML = results;
    }

    searchCoupon() {
        let search = document.querySelector("#searchCoupon");
        let body = document.querySelector(".body-table");
        search.addEventListener("keydown", async (e) => {
            if (e.keyCode == 13) {
                await coupon.getOneCoupon(search.value)
                    .then(response => {
                        let data = response.data;
                        let item = this.renderCouponItem(data);
                        body.innerHTML = item;
                    }).catch(error => {
                        body.innerHTML = "Không tìm thấy coupon.";
                        document.querySelector(".pagination").innerHTML = "";
                    });
            }
        });
    }

    submitFormNewCoupon() {
        let form = document.querySelector(".add-coupon-form form");
        let name = form.querySelector("#coupon-name");
        let value = form.querySelector("#coupon-value");
        let quantity = form.querySelector("#coupon-quantity");
        let condition = form.querySelector("#coupon-condition");
        let expiredDate = form.querySelector("#expired-date");
        let btnSave = document.querySelector("#btn-add-coupon");

        btnSave.addEventListener("click", async () => {
            const request = {
                "name": name.value.toUpperCase(),
                "valueCoupon": value.value,
                "quantity": quantity.value,
                "conditionCoupon": condition.value,
                "expiredDate": expiredDate.value
            }

            await coupon.createNewCoupon(request).then(response => {
                console.log(response);
                if (response.status === 201) {
                    toast.showSuccessToast("Thêm coupon thành công.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    let message = response.message;
                    let index = message.lastIndexOf(":");
                    message = message.slice(index + 1).trim();
                    toast.showErrorToast(message);
                }
            });
        });
    }

    submitFormUpdateCoupon(form) {
        let name = form.querySelector("#coupon-name");
        let value = form.querySelector("#coupon-value");
        let quantity = form.querySelector("#coupon-quantity");
        let condition = form.querySelector("#coupon-condition");
        let expiredDate = form.querySelector("#expired-date");
        let btnSave = form.querySelector("#btn-update-coupon");

        let id = btnSave.getAttribute("data-id");

        btnSave.addEventListener("click", async () => {
            const request = {
                "id": id,
                "name": name.value.toUpperCase(),
                "valueCoupon": value.value,
                "quantity": quantity.value,
                "conditionCoupon": condition.value,
                "expiredDate": expiredDate.value
            }

            await coupon.updateCoupon(request).then(response => {
                if (response.status === 200) {
                    toast.showSuccessToast("Cập nhật coupon thành công.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    let message = response.message;
                    let index = message.lastIndexOf(":");
                    message = message.slice(index + 1).trim();
                    toast.showErrorToast(message);
                }
            });
        });
    }

    async loadInfoCoupon(name) {
        const response = await coupon.getOneCoupon(name);
        const data = response.status === 200 ? response.data : response.message;
        return `
        <form class="row" method="POST">
            <div class="mb3 col-lg-12">
                <label for="coupon-name" class="form-label">Tên coupon</label>
                <input type="text" class="form-control" id="coupon-name" value="${data.name}">
            </div>
            <div class="mb3 col-lg-4">
                <label for="coupon-value" class="form-label">Giá trị coupon</label>
                <input type="number" class="form-control" id="coupon-value" value="${data.valueCoupon}">
            </div>
            <div class="mb3 col-lg-4">
                <label for="coupon-quantity" class="form-label">Số lượng</label>
                <input type="number" class="form-control" id="coupon-quantity" value="${data.quantity}">
            </div>
            <div class="mb3 col-lg-4">
                <label for="coupon-condition" class="form-label">
                    Áp dụng cho đơn hàng tối thiểu
                </label>
                <input type="number" class="form-control" id="coupon-condition" value="${data.conditionCoupon}">
            </div>
            <div class="startDate">
                <label for="expired-date" class="form-label">
                    Ngày hết hạn
                </label>
                <input type="date" id="expired-date" class="form-control" placeholder="Select DateTime"
                value="${data.expiredDate}" >
            </div>
            <div class="d-flex flex-row-reverse">
                <button data-id="${data.id}" id="btn-update-coupon" type="button">Cập nhật</button>
            </div>
        </form>
        `;
    }

    async loadValidCoupons(container, page = 1) {
        const response = await coupon.getValidCoupon();
        const data = response.status === 200 ? response : [];
        this.renderTableCoupons(data, container, page);
        return data.totalPages;
    }
}