import Admin from '../../entities/Admin.js';
import Toast from '../Toast.js';

const admin = new Admin();
const toast = new Toast();

export default class TableUser {
    modalFormCreateAdmin() {
        return `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="submit" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                    <div class="myform">
                        <div class="heading-text-center">
                            <h1 class="text-center">Tạo tài khoản Admin</h1>
                        </div>
                        <form>
                            <div class="mb-3 mt-4">
                                <label for="emailSignUp" class="form-label">Email</label>
                                <input type="email" class="form-control" id="emailSignUp"
                                    aria-describedby="emailHelp">
                                <div class="error-mess"></div>
                            </div>
                            <div class="mb-3">
                                <label for="passwordSignUp" class="form-label">Mật khẩu</label>
                                <input type="password" class="form-control" id="passwordSignUp">
                                <div class="error-mess"></div>
                            </div>
                            <button type="submit" class="btn mt-3">TẠO</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    checkValidForm(modal) {
        let email = modal.querySelector("#emailSignUp");
        let password = modal.querySelector("#passwordSignUp");
        let errorMessage = modal.querySelectorAll(".error-mess");
        let countErr = 0;

        const validateEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };

        if (!validateEmail(email.value)) {
            errorMessage[0].innerHTML = "Email không hợp lệ.";
            countErr++;
        } else {
            errorMessage[0].innerHTML = "";
        }

        if (password.value.length < 8 || password.value.length === 0) {
            errorMessage[1].innerHTML = "Mật khẩu phải có từ 8 kí tự.";
            countErr++;
        } else {
            errorMessage[1].innerHTML = "";
        }

        if (countErr === 0) {
            let request = {
                "email": email.value,
                "password": password.value
            };

            return request;
        }
    }

    createAccAdmin(modal) {
        let btnCreate = modal.querySelector(".btn");

        btnCreate.addEventListener("click", async (e) => {
            e.preventDefault();

            let request = this.checkValidForm(modal);
            await admin.createAccountAdmin(request)
                .then((response) => {
                    toast.showSuccessToast(response.message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })
                .catch(err => toast.showErrorToast(err));
        });
    }

    renderListUsers(item) {
        let userName = item.userName !== null ? item.userName : item.email;
        let phone = item.phone !== null ? item.phone : "";
        let status = "";
        if (item.accountLocked) {
            status = `
            <td>
                <button data-id="${item.email}" data-status="${!item.accountLocked}" id="btn-lock-acc" type="button"><i class="fa-solid fa-lock"></i></button>
            </td>
            `;
        } else {
            status = `
            <td>
                <button data-id="${item.email}" data-status="${!item.accountLocked}" id="btn-lock-acc" type="button"><i class="fa-solid fa-lock-open"></i></button>
            </td>
            `;
        }
        return `
        <tr>
            <td>#${item.id}</td>
            <td>${userName}</td>
            <td>${phone}</td>
            <td>${item.email}</td>
            ${status}
        </tr>
        `;
    }

    async renderTableUsers(container, page) {
        const data = await admin.getAllUsers(page).then(response => {
            return response.status === 200 ? response.data : response.message;
        });
        const dataUsers = data.data;
        const listUsers = dataUsers.map(item => this.renderListUsers(item)).join('');
        let results = `
        <div class="container-fluid">
            <div class="container">
                <div class="nav-btn-search d-flex align-items-center search-dashboard">
                    <input id="searchUser" class="form-control" type="text" placeholder="Nhập email người dùng ...">
                    <button id="searchIcon" class="btn text-dark" type="button">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
                <div class="d-flex justify-content-end">
                    <div class="btn-filter-status-order">
                        <button type="button" id="create-admin" class="dropdown-item dropdown-custom"
                        data-bs-toggle="modal" data-bs-target="#ModalFormCreateAdmin">
                            Tạo tài khoản Admin
                        </button>
                    </div>
                    <div class="btn-filter-status-order">
                        <button type="button" id="role-admin">ADMIN</button>
                    </div>
                    <div class="btn-filter-status-order">
                        <button type="button" id="role-user">USER</button>
                    </div>
                </div>
                <table class="table table-striped table-responsive table-dashboard">
                    <thead class="heading-table">
                        <tr>
                            <th>ID</th>
                            <th>Khách hàng</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody class="body-table">
                        ${listUsers}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="pagination"><ul></ul></div>
        `;
        container.innerHTML = results;
        return data.totalPages;
    }

    async renderTableUsersByRole(container, page, role) {
        const data = await admin.getListUsersByRole(page, role).then(response => {
            return response.status === 200 ? response.data : response.message;
        });
        const dataUsers = data.data;
        console.log(dataUsers);
        const listUsers = dataUsers.map(item => this.renderListUsers(item)).join('');
        let results = `
        <div class="container-fluid">
            <div class="container">
                <div class="nav-btn-search d-flex align-items-center search-dashboard">
                    <input id="searchUser" class="form-control" type="text" placeholder="Nhập tên người dùng ...">
                    <button id="searchIcon" class="btn text-dark" type="button">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
                <div class="d-flex justify-content-end">
                    <div class="btn-filter-status-order">
                        <button type="button" id="role-admin">ADMIN</button>
                    </div>
                    <div class="btn-filter-status-order">
                        <button type="button" id="role-user">USER</button>
                    </div>
                </div>
                <table class="table table-striped table-responsive table-dashboard">
                    <thead class="heading-table">
                        <tr>
                            <th>ID</th>
                            <th>Khách hàng</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody class="body-table">
                        ${listUsers}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="pagination"><ul></ul></div>
        `;
        container.innerHTML = results;
        return data.totalPages;
    }

    searchUser() {
        let search = document.querySelector("#searchUser");
        let body = document.querySelector(".body-table");
        search.addEventListener("keydown", async (e) => {
            if (e.keyCode == 13) {
                await admin.getUserByEmail(search.value)
                    .then(response => {
                        let data = response.data;
                        let item = this.renderListUsers(data);
                        body.innerHTML = item;
                    }).catch(error => {
                        body.innerHTML = "Không tìm thấy người dùng.";
                        document.querySelector(".pagination").innerHTML = "";
                    });
            }
        });
    }

    async btnLockedAcc(btn) {
        let email = btn.getAttribute("data-id");
        let status = btn.getAttribute("data-status");
        const data = await admin.lockedAccount(email, status);
        return data;
    }

    showConfirmationPopup(callback, email, action) {
        const confirmed = confirm(`Bạn xác nhận muốn ${action} tài khoản ${email} ?`);
        callback(confirmed);
    }
}