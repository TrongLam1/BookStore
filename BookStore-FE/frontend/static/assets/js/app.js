import HomeView from "./views/client/HomeView.js";
import SearchView from "./views/client/SearchView.js";
import NotFound from "./views/404.js"
import General from "./views/General.js";
import Authen from "./views/Authentication.js";
import Profile from "./views/client/ProfileView.js";
import CategoryBook from "./views/client/CategoryBookView.js";
import ShoppingCart from "./entities/ShoppingCart.js";
import CartView from "./views/client/CartView.js";
import Checkout from "./views/client/CheckoutView.js";
import OrderDetail from "./views/client/OrderDetailView.js";
import BookDetail from "./views/client/BookDetailView.js";
import Payment from "./views/client/Payment.js";
import Coupon from "./views/client/CouponView.js";
import DashBoard from "./views/dashboard/DashBoardView.js";
import AuthenticationEntity from "./entities/AuthenticationEntity.js";
import Toast from "./views/Toast.js";

const app = document.querySelector(".app");
const header = document.querySelector("#header");
const main = document.querySelector("#body");
const footer = document.querySelector("#footer");
const modalSignIn = document.querySelector("#ModalFormSignIn");
const modalSignUp = document.querySelector("#ModalFormSignUp");

const general = new General();
const authen = new Authen();
const shoppingCart = new ShoppingCart();
const authenticationEntity = new AuthenticationEntity();
const toast = new Toast();

header.innerHTML = general.createHeader();
footer.innerHTML = general.createFooter();
modalSignUp.innerHTML = authen.signUpModal();
modalSignIn.innerHTML = authen.signInModal();
//modalRating.innerHTML = bookDetail.renderModalRating();

let refreshTokenInProgress = false;

axios.interceptors.request.use(async (req) => {
    if (localStorage.getItem('user') != null) {
        let user = JSON.parse(localStorage.getItem('user'));
        let expiredTime = new Date(user.expiredTime);
        let check = new Date();
        if (expiredTime < check.getTime() && !refreshTokenInProgress) {
            refreshTokenInProgress = true;
            await authen.refreshToken().then(() => {
                refreshTokenInProgress = false;
                window.location.reload();
            });
        }
    }
    return req;
});

async function checkLogin() {
    if (localStorage.getItem('user') != null) {
        await authen.renderUserLogIn();
    }
}

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};

    urlParams.forEach((value, key) => {
        params[key] = value;
    });

    const pathParams = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);

    keys.forEach((key, i) => {
        if (key === 'name') {
            const nameValue = pathParams[i].split('?')[0];
            params[key] = nameValue;
        } else {
            params[key] = pathParams[i];
        }
    });

    return params;
};

const router = async () => {
    const routes = [
        { path: "/404", view: NotFound },
        { path: "/", view: HomeView },
        { path: "/search/name/:name", view: SearchView },
        { path: "/profile", view: Profile },
        { path: "/category/:category", view: CategoryBook },
        { path: "/shopping-cart", view: CartView },
        { path: "/check-out", view: Checkout },
        { path: "/order-detail/:id", view: OrderDetail },
        { path: "/book/:id/:page", view: BookDetail },
        { path: "/coupon", view: Coupon },
        { path: "/payment/success", view: Payment },
        { path: "/dashboard", view: DashBoard }
    ];

    // const url = window.location.pathname + window.location.search;
    const url = window.location.pathname;
    const potentialMatches = routes.map((route) => {
        return {
            route,
            result: url.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: url === "/404"
        };
    }

    const view = new match.route.view(getParams(match));
    main.innerHTML = await view.getHtml();
    view.funcForPage();
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

document.addEventListener("DOMContentLoaded", async () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    await router();

    checkLogin().then(() => {
        var removeProductBtn = document.querySelectorAll(".product-cart-remove");
        shoppingCart.btnRemoveProduct(removeProductBtn);

        var inputQuantities = document.querySelectorAll(".product-cart-quantity input");
        updateQuantity(inputQuantities);
    });

    if (window.location.pathname === "/shopping-cart") {
        var inputQuantity = document.querySelectorAll(".cart-item-quantity input");
        updateQuantity(inputQuantity);
        let btnUpdate = document.querySelector(".update-cart");
        btnUpdate.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.reload();
        });
    }
});

main.addEventListener('load', () => {
    view.funcForPage();
});

window.addEventListener("popstate", router);

// ------------------------------------------------------------------------------------------------

let search = document.querySelector("#searchInput");
let searchMobile = document.querySelector("#searchInput-mobile");
let searchIcon = document.querySelector("#searchIcon-mobile");

function searchProduct(search) {
    let url = "http://localhost:3000/search/name/" + search.value;
    history.pushState("", "", url);
    router();
}

search.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
        searchProduct(search);
    }
});

if (searchMobile) {
    searchMobile.addEventListener("keydown", (e) => {
        console.log(e.keyCode);
        if (e.keyCode == 13) {
            searchProduct(searchMobile);
        }
    });
}

searchIcon.addEventListener("click", () => {
    console.log(searchIcon);
    searchProduct(searchMobile);
})
// ------------------------------------------------------------------------------------------------
let btnResetPassword = modalSignIn.querySelector("#forget-pass");
btnResetPassword.addEventListener("click", () => {
    modalSignIn.innerHTML = authen.sendOtpModal();

    let btnSendOtp = modalSignIn.querySelector("#send-otp");
    btnSendOtp.addEventListener("click", async () => {
        let response = authen.checkEmailOtpModal(modalSignIn);
        if (response.validForm) {
            await authenticationEntity.sendOtp(response.email).then(() => {
                modalSignIn.innerHTML = authen.resetPasswordModal();

                let btnReset = modalSignIn.querySelector("#reset-pass");
                btnReset.addEventListener("click", async () => {
                    let res = authen.checkResetPasswordModal(modalSignIn);
                    if (res.validForm) {
                        let requestReset = {
                            "otp": res.otp,
                            "newpass": res.newPass,
                            "email": response.email
                        };
                        await authenticationEntity.resetPassword(requestReset)
                            .then(() => {
                                modalSignIn.querySelector(".btn-close").click();
                                toast.showSuccessToast("Đổi mật khẩu thành công.");
                            });
                    }
                });
            });
        }
    });
});
// ------------------------------------------------------------------------------------------------

var btnSignUp = modalSignUp.querySelector(".btn-sign-up");
var btnSignIn = modalSignIn.querySelector(".btn.mt-3");

btnSignUp.addEventListener("click", async (e) => {
    e.preventDefault();
    const response = await authen.funcSignUp(btnSignUp)
        .then(data => {
        if (data.status === 201) {
            toast.showSuccessToast("Đăng kí thành công.");
            modalSignUp.querySelector(".btn-close").click();
        } else {
            toast.showErrorToast(data.message);
        }
    }).catch(err => console.log(err));
});

btnSignIn.addEventListener("click", async (e) => {
    e.preventDefault();
    await authen.funcSignIn(btnSignIn).then(res => {
        if (res) { modalSignIn.querySelector(".btn-close").click(); }
    }).catch(err => toast.showErrorToast("Tài khoản hoặc mật khẩu không đúng."));
});

// ------------------------------------------------------------------------------------------------
function updateQuantity(element) {
    element.forEach(item => {
        item.addEventListener("change", async (e) => {
            e.preventDefault();
            if (item.value < 1) {
                item.value = 1;
            }
            if (localStorage.getItem('user') !== null) {
                await shoppingCart.updateQuantityBook(item.getAttribute("data-id"), item.value)
                    .then(() => window.location.reload());
            } else {
                await shoppingCart.updateQuantityBookToCookie(item.getAttribute("data-id"), item.value)
                    .then(() => window.location.reload());
            }
            
        });
    });
}
// --------------------------------------------------------------------------------------
let openSidebar = document.querySelector(".btn-open-sidebar button");
let closeSidebar = document.querySelector(".btn-close-sidebar button");
openSidebar.addEventListener("click", () => {
    let layout = document.querySelector(".over-layout");
    layout.style.display = "block";
});

closeSidebar.addEventListener("click", () => {
    let layout = document.querySelector(".over-layout");
    layout.style.display = "none";
});

// ---------------------------------------------------------------------------------------
var cart = document.querySelector(".shopping-cart");
const cartItems = await shoppingCart.renderCartItemsListHeader();
cart.innerHTML = cartItems;
