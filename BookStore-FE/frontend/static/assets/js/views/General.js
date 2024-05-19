export default class General {
    createHeader() {
        return `
            <header>
                <nav class="navbar-header navbar navbar-expand-sm">
                    <a href="/" class="navbar-brand navbar-logo data-link">
                        <img class="navbar-img-logo" src="/static/images/logo.png" alt="Logo">
                    </a>
                    <div class="navbar-mobile-container">
                        <div class="btn-open-sidebar">
                            <button type="button">
                                <i class="fa-solid fa-bars"></i>
                            </button>
                        </div>
                        <div class="over-layout">
                            <div class="navbar-mobile-menu">
                                <div class="btn-close-sidebar">
                                    <button type="button">
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                                <div class="nav-btn-search d-flex">
                                    <input id="searchInput-mobile" class="form-control" type="text">
                                    <button id="searchIcon-mobile" class="btn text-dark" type="button">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                                <ul class="menu-items">
                                    <li class="menu-item">
                                        <button type="button" id="btn-signup" class="dropdown-item dropdown-custom"
                                            data-bs-toggle="modal" data-bs-target="#ModalFormSignUp">
                                            Đăng kí
                                        </button>
                                    </li>
                                    <li class="menu-item">
                                        <button type="button" id="btn-signin" class="dropdown-item dropdown-custom" data-bs-toggle="modal"
                                            data-bs-target="#ModalFormSignIn">
                                            Đăng nhập
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="collapse navbar-collapse justify-content-evenly" id="mynavbar">
                        <div class="nav-btn-search d-flex align-items-center">
                            <input id="searchInput" class="form-control" type="text"
                                placeholder="Tìm kiếm sản phẩm ...">
                            <button id="searchIcon" class="btn text-dark" type="button">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                        <div class="button-account">
                            <button type="button" class="login btn dropdown-toggle align-items-center"
                                data-bs-toggle="dropdown">
                                <i class="fa-regular fa-user"></i>
                                <span>Tài khoản</span>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <button type="button" id="btn-signup" class="dropdown-item dropdown-custom"
                                        data-bs-toggle="modal" data-bs-target="#ModalFormSignUp">
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
                        </div>
                        <div class="shopping-cart">
                            <button type="button" class="dropdown-cart dropdown-toggle" data-bs-toggle="dropdown">
                                <i class="shopping-cart-icon fa-solid fa-cart-shopping"></i>
                                <span>Giỏ hàng</span>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end list-products-cart" style="top: 220%">
                                <div class="list-cart-container">
                                    <div class="caret-up"><i class="fa-solid fa-caret-up"></i></div>
                                    <h5 class="heading-cart">Giỏ hàng</h5>
                                    <div class="no-cart">
                                        <img src="http://localhost:3000/static/images/no-cart.png" alt="">
                                        <h5>Chưa có sản phẩm trong giỏ hàng</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }

    createFooter() {
        return `
            <footer>
                <div class="heading-footer">
                    <div class="heading-content row d-flex justify-content-between">
                        <div class="heading-content-social col-xl-6 col-lg-4 col-sm-12 col-12">
                            <i class="fa-brands fa-square-facebook"></i>
                            <i class="fa-brands fa-square-instagram"></i>
                            <i class="fa-brands fa-linkedin"></i>
                        </div>
                        <div
                            class="heading-content-subcribe d-flex align-items-center col-xl-6 col-lg-8 col-sm-12 col-12">
                            <i class="fa-solid fa-envelope"></i>
                            <div class="subcribe d-flex flex-column">
                                <span>Bạn muốn nhận khuyến mãi đặc biệt?</span>
                                <span>Đăng ký ngay.</span>
                            </div>
                            <div class="form-subcribe">
                                <input id="subcribe" name="subcribe" type="text">
                                <button>Đăng ký</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-footer">
                    <div class="info-footer-wrap row d-flex justify-content-between">
                        <div class="info-footer-item col-lg-3 col-12 col-sm-6">
                            <div class="logo">
                                <img src="/static/images/logo.png" alt="Logo">
                            </div>
                            <div class="contact address">
                                <i class="fa-solid fa-location-dot"></i>
                                <strong>Địa chỉ: </strong>
                                <span>Số 2, Đường Võ Oanh, P.25, Q. Bình Thạnh, Thành Phố Hồ Chí Minh</span>
                            </div>
                            <div class="contact phone-number">
                                <i class="fa-solid fa-phone"></i>
                                <strong>SĐT: </strong>
                                <span>0123456789</span>
                            </div>
                            <div class="contact email-support">
                                <i class="fa-solid fa-envelope"></i>
                                <strong>Email: </strong>
                                <span>supportBook@gmail.com</span>
                            </div>
                            <div>
                                <img src="/static/images/bocongthuong.webp" alt="">
                            </div>
                        </div>
                        <div class="info-footer-item col-lg-3 col-12 col-sm-6">
                            <ul>
                                Hỗ trợ
                                <li>Hướng dẫn đặt hàng</li>
                                <li>Câu hỏi thường gặp</li>
                                <li>Chính sách đổi trả</li>
                                <li>Chính sách bảo mật</li>
                            </ul>
                        </div>
                        <div class="info-footer-item col-lg-3 col-12 col-sm-6">
                            <ul>
                                Về Book Store
                                <li>Giới thiệu về Book Store</l>
                            </ul>
                        </div>
                        <div class="info-footer-item col-lg-3 col-12 col-sm-6">
                            <ul>
                                Tổng đài hỗ trợ
                                <li>Gọi mua hàng</li>
                                <li>Gọi khiếu nại</li>
                                <li>
                                    <b>Phương thức thanh toán</b>
                                </li>
                                <img src="/static/images/thanhtoan.webp" alt="">
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="copy-right">
                    &#9400 Thành phố Hồ Chí Minh, 2024
                </div>
            </footer>
        `;
    }

    createBanner() {
        return `
            <div class="banner row">
                        <div id="carousel-custom" class="carousel slide col-lg-8 col-md-12" data-bs-ride="carousel">
                            <div class="banner-custom carousel-inner ">
                                <div class="carousel-item-custom carousel-item active">
                                    <img src="./static/images/slider/slider1.jpg" class="d-block w-100" alt="...">
                                </div>
                                <div class="carousel-item-custom carousel-item">
                                    <img src="./static/images/slider/slider2.jpg" class="d-block w-100" alt="...">
                                </div>
                                <div class="carousel-item-custom carousel-item">
                                    <img src="./static/images/slider/slider3.jpg" class="d-block w-100" alt="...">
                                </div>
                            </div>
                            <button class="carousel-prev-custom carousel-control-prev" type="button"
                                data-bs-target="#carousel-custom" data-bs-slide="prev">
                                <i class="fa-solid fa-chevron-left"></i>
                                <!-- <span class="visually-hidden">Previous</span> -->
                            </button>
                            <button class="carousel-next-custom carousel-control-next" type="button"
                                data-bs-target="#carousel-custom" data-bs-slide="next">
                                <i class="fa-solid fa-chevron-right"></i>
                                <!-- <span class="visually-hidden">Next</span> -->
                            </button>
                        </div>
                        <div class="banner-deal-custom carousel col-lg-4">
                            <div class="banner-deal-item">
                                <img src="./static/images/slider/banner1.jpg" alt="">
                            </div>
                            <div class="banner-deal-item">
                                <img src="./static/images/slider/banner2.jpg" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="list-type-book">
                        <ul class="list-type row">
                            <li class="list-type-item col-lg-2 col-6 col-sm-4">
                                <a href="/category/Sách%20mới%202024" class="d-flex flex-column align-items-center">
                                    <img class="type-book-img" src="./static/images/type-book/newbook.webp" alt="">
                                    <span>Sách mới 2024</span>
                                </a>
                            </li>
                            <li class="list-type-item col-lg-2 col-6 col-sm-4">
                                <a href="/category/Từ%20điển" class="d-flex flex-column align-items-center">
                                    <img src="./static/images/type-book/tudien.webp" alt="" class="type-book-img">
                                    Tủ sách từ điển
                                </a>
                            </li>
                            <li class="list-type-item col-lg-2 col-6 col-sm-4">
                                <a href="/category/Hội%20họa" class="d-flex flex-column align-items-center">
                                    <img src="./static/images/type-book/hoihoa.webp" alt="" class="type-book-img">
                                    Tủ sách hội họa
                                </a>
                            </li>
                            <li class="list-type-item col-lg-2 col-6 col-sm-4">
                                <a href="/category/Lịch%20sử" class="d-flex flex-column align-items-center">
                                    <img src="./static/images/type-book/lichsu.webp" alt="" class="type-book-img">
                                    Từ điển lịch sử
                                </a>
                            </li>
                            <li class="list-type-item col-lg-2 col-6 col-sm-4">
                                <a href="/category/Thiếu%20nhi" class="d-flex flex-column align-items-center">
                                    <img src="./static/images/type-book/thieunhi.webp" alt="" class="type-book-img">
                                    Tủ sách thiếu nhi
                                </a>
                            </li>
                            <li class="list-type-item col-lg-2 col-6 col-sm-4">
                                <a href="/category/all" class="d-flex flex-column align-items-center">
                                    <img src="./static/images/type-book/all.webp" alt="" class="type-book-img">
                                    Tất cả sách
                                </a>
                            </li>
                        </ul>
                    </div>
        `;
    }
}