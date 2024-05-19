import ShoppingCart from "../entities/ShoppingCart.js";
import AuthenticationEntity from "../entities/AuthenticationEntity.js";
import Toast from "./Toast.js";

const shoppingCart = new ShoppingCart();
const authentication = new AuthenticationEntity();
const toast = new Toast();

export default class Authentication {
    signUpModal() {
        return `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="submit" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                    <div class="myform">
                        <div class="heading-text-center">
                            <h1 class="text-center">Đăng kí</h1>
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
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">Nhập lại mật khẩu</label>
                                <input type="password" class="form-control" id="confirmPassword">
                                <div class="error-mess"></div>
                            </div>
                            <button type="submit" class="btn mt-3">ĐĂNG KÍ</button>
                            <p>Bạn đã có tài khoản? <button class="modal-btn" type="button"
                                data-bs-toggle="modal" data-bs-target="#ModalFormSignIn">Đăng nhập</button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    signInModal() {
        return `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                    <div class="myform">
                        <h1 class="text-center">Đăng nhập</h1>
                        <form>
                            <div class="mb-3 mt-4">
                                <label for="emailSignIn" class="form-label">Email</label>
                                <input type="email" class="form-control" id="emailSignIn"
                                    aria-describedby="emailHelp">
                                <div class="error-mess"></div>
                            </div>
                            <div class="mb-3">
                                <label for="passwordSignIn" class="form-label">Mật khẩu</label>
                                <input type="password" class="form-control" id="passwordSignIn">
                                <div class="error-mess"></div>
                            </div>
                            <button type="button" class="btn mt-3">ĐĂNG NHẬP</button>
                            <button type="button" id="forget-pass">Quên mật khẩu ?</button>
                            <p>Bạn chưa có tài khoản? <button class="modal-btn" type="button"
                                data-bs-toggle="modal" data-bs-target="#ModalFormSignUp">Đăng kí</button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    sendOtpModal() {
        return `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                    <div class="myform">
                        <h1 class="text-center">Quên mật khẩu?</h1>
                        <form>
                            <div class="mb-3 mt-4">
                                <label for="emailReset" class="form-label">Email</label>
                                <input type="email" class="form-control" id="emailReset"
                                    aria-describedby="emailHelp">
                                <div class="error-mess"></div>
                            </div>
                            <button type="button" class="btn mt-3" id="send-otp">GỬI MÃ OTP</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    checkEmailOtpModal(modal) {
        let email = modal.querySelector("#emailReset");
        let err = modal.querySelector(".error-mess");
        let validForm = true;
        const validateEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };

        if (!validateEmail(email.value)) {
            err.innerHTML = "Email không hợp lệ.";
            validForm = false;
        } else {
            err.innerHTML = "";
            validForm = true;
        }

        return {validForm: validForm, email: email.value};
    }

    resetPasswordModal() {
        return `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                    <div class="myform">
                        <h1 class="text-center">Đổi mật khẩu</h1>
                        <form>
                            <div class="mb-3 mt-4">
                                <label for="otp" class="form-label">Mã OTP</label>
                                <input type="text" class="form-control" id="otp"
                                    aria-describedby="otp" maxlength="6" minlength="6">
                                <div class="error-mess"></div>
                            </div>
                            <div class="mb-3">
                                <label for="resetPass" class="form-label">Mật khẩu mới</label>
                                <input type="password" class="form-control" id="resetPass" minlength="8">
                                <div class="error-mess"></div>
                            </div>
                            <div class="mb-3">
                                <label for="confirmPass" class="form-label">Nhập lại mật khẩu</label>
                                <input type="password" class="form-control" id="confirmPass" minlength="8">
                                <div class="error-mess"></div>
                            </div>
                            <button type="button" class="btn mt-3" id="reset-pass">ĐỔI MẬT KHẨU</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    checkResetPasswordModal(modal) {
        let otp = modal.querySelector("#otp");
        let newPass = modal.querySelector("#resetPass");
        let confirmPassword = modal.querySelector("#confirmPass");
        let errs = modal.querySelectorAll(".error-mess");
        let count = 0;
        let validForm = true;

        if (isNaN(otp.value)) {
            errs[0].innerHTML = "Mã OTP không hợp lệ.";
            count++;
        } else {
            errs[0].innerHTML = "";
        }

        if (newPass.value.length < 8) {
            errs[1].innerHTML = "Mật khẩu phải từ 8 kí tự.";
            count++;
        } else {
            errs[1].innerHTML = "";
        }

        if (confirmPassword.value !== newPass.value) {
            errs[2].innerHTML = "Nhập lại mật khẩu không đúng.";
            count++;
        } else {
            errs[2].innerHTML = "";
        }

        validForm = count > 0 ? false : true;

        return { validForm: validForm, otp: otp.value, newPass: newPass.value };
    }

    funcSignUp(item) {
        let countErr = 0;
        let modal = item.parentNode;
        let emailInput = modal.querySelector("#emailSignUp");
        let password = modal.querySelector("#passwordSignUp");
        let confirmPassword = modal.querySelector("#confirmPassword");
        let errorMessage = modal.querySelectorAll(".error-mess");
        let validForm = true;

        const validateEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };

        if (!validateEmail(emailInput.value)) {
            errorMessage[0].innerHTML = "Email không hợp lệ.";
            countErr++;
        } else {
            errorMessage[0].innerHTML = "";
        }

        if (password.value.length < 8) {
            errorMessage[1].innerHTML = "Mật khẩu phải có từ 8 kí tự.";
            countErr++;
        } else {
            errorMessage[1].innerHTML = "";
        }

        if (password.value !== confirmPassword.value) {
            errorMessage[2].innerHTML = "Nhập lại mật khẩu không đúng.";
            countErr++;
        } else {
            errorMessage[2].innerHTML = "";
        }

        if (countErr > 0) validForm = false;

        if (validForm) {
            const response = authentication.postSignUp(emailInput.value, password.value);
            const data = response.data;
            emailInput.value = '';
            password.value = '';
            confirmPassword.value = '';
            return data;
        }
    }

    async funcSignIn(item) {
        let modal = item.parentNode;
        let emailInput = modal.querySelector("#emailSignIn");
        let password = modal.querySelector("#passwordSignIn");
        let errorMessage = modal.querySelectorAll(".error-mess");
        let validForm = true;

        const validateEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };

        if (!validateEmail(emailInput.value)) {
            errorMessage[0].innerHTML = "Email không hợp lệ.";
            validForm = false;
        } else {
            errorMessage[0].innerHTML = "";
            validForm = true;
        }

        if (password.value.length < 8) {
            errorMessage[1].innerHTML = "Mật khẩu phải có từ 8 kí tự.";
            validForm = false;
        } else {
            errorMessage[1].innerHTML = "";
            validForm = true;
        }

        if (validForm) {
            const response = await authentication.postSignIn(emailInput.value, password.value);
            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('user', JSON.stringify(data));
                emailInput.value = '';
                password.value = '';

                this.renderUserLogIn();

                if (data.role === "ADMIN") {
                    window.location.href = "http://localhost:3000/dashboard";
                }
            } else {
                let parts = response.message.split(":");
                toast.showErrorToast(parts[parts.length - 1]);
            }
        }
    }

    async renderUserLogIn() {
        let userInfo = document.querySelector(".button-account");
        let sideBarContainer = document.querySelector(".navbar-mobile-menu");

        if (!userInfo) return;

        let data = JSON.parse(localStorage.getItem('user'));
        let name = data.name;
        userInfo.innerHTML = `
        <button type="button" class="login btn dropdown-toggle align-items-center" data-bs-toggle="dropdown">
            <i class="fa-regular fa-user"></i>
            <div>
                <span>Xin chào,</span>
                <span id="username">${name}</span>
            </div>
        </button>
        <ul class="dropdown-menu">
            <li>
                <a href="/profile" class="dropdown-item dropdown-custom">
                    Thông tin cá nhân
                </a>
            </li>
            <li>
                <button type="button" id="btnLogout" class="dropdown-item dropdown-custom">
                    Đăng xuất
                </button>
            </li>
        </ul>
        `;

        if (sideBarContainer) {
            let sideBarMenu = sideBarContainer.querySelector(".menu-items");
            sideBarMenu.innerHTML = `
            <li class="menu-item heading">Xin chào, <strong>${name}</strong></li>
            <li class="menu-item">
                <a href="/profile">
                    <i class="fa-solid fa-user"></i>
                    Thông tin cá nhân
                </a>
            </li>
            <li class="menu-item">
                <a href="/shopping-cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    Giỏ hàng
                </a>
            </li>
            <li class="menu-item">
                <button type="button" id="btnLogout-mobile">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    Đăng xuất
                </button>
            </li>
            `;
        }

        var cart = document.querySelector(".shopping-cart");
        const cartItems = await shoppingCart.renderCartItemsListHeader();
        cart.innerHTML = cartItems;

        let btnLogout = document.querySelector("#btnLogout");
        let btnLogoutMobile = document.querySelector("#btnLogout-mobile");
        if (btnLogout) {
            btnLogout.addEventListener("click", async (e) => {
                e.preventDefault();
                await authentication.logOut().then(() => this.renderUserLogOut());
            });
        }
        if (btnLogoutMobile) {
            btnLogoutMobile.addEventListener("click", async (e) => {
                e.preventDefault();
                await authentication.logOut().then(() => this.renderUserLogOut());
            });
        }
    }

    renderUserLogOut() {
        let userInfo = document.querySelector(".button-account");
        localStorage.removeItem('user');
        userInfo.innerHTML = `
        <button type="button" class="login btn dropdown-toggle align-items-center" data-bs-toggle="dropdown">
            <i class="fa-regular fa-user"></i>
            <span>Tài khoản</span>
        </button>
        <ul class="dropdown-menu">
            <li>
                <button type="button" id="btn-signup" class="dropdown-item dropdown-custom" data-bs-toggle="modal"
                    data-bs-target="#ModalFormSignUp">
                    Đăng kí
                </button>
            </li>
            <li>
                <button type="button" id="btn-signin" class="dropdown-item dropdown-custom" data-bs-toggle="modal"
                    data-bs-target="#ModalFormSignIn">
                    Đăng nhập
                </button>
            </li>
        </ul>
        `;

        window.location.href = "http://localhost";
    }

    async refreshToken() {
        try {
            const data = JSON.parse(localStorage.getItem('user'));
            const refreshToken = data.refreshToken;
            const url = "http://localhost:8080/api/v1/authen/refresh-token/" + refreshToken;
            const response = await axios.get(url, {
                headers: { 'Content-type': 'application/json' }
            });
            localStorage.setItem('user', JSON.stringify(response.data.data));
        } catch (e) {
            console.log(e.message);
        }
    }
}