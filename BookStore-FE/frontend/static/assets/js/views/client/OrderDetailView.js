import Abstract from '../AbstractView.js';
import ShoppingCart from '../../entities/ShoppingCart.js';
import Order from '../../entities/Order.js';

const shoppingCart = new ShoppingCart();
const order = new Order();

const vietnamese = new Map([
    ["Cancelled", "Đã hủy"],
    ["Shipping", "Đang giao"],
    ["Delivered", "Đã hoàn thành"],
    ["Pending", "Đang xử lí"],
    ["Paid", "Đã thanh toán"],
    ["Unpaid", "Chưa thanh toán"]
]);

export default class CartView extends Abstract {
    constructor(params) {
        super(params);
        this.setTitle("Order Detail");
    }

    renderTableOrderItem(data) {
        const item = data.book;
        return `
        <tbody>
            <tr>
                <td class="order-item">
                    <div>
                        <img src="${item.image_url}" alt="">
                    </div>
                    <div class="order-item-info">
                        <div id="name">${item.name}</div>
                        <div id="price">${item.salePrice.toLocaleString()}đ</div>
                    </div>
                </td>
                <td>x2</td>
                <td class="order-item-total">${data.totalPrice.toLocaleString()}</td>
            </tr>
        </tbody>
        `;
    }

    renderOrderInfoUser(data) {
        console.log(data);
        let btnCancelOrder = "";
        let btnPayment = "";
        let coupon = "";
        if (data.status !== "Delivered" && data.status !== "Cancelled") {
            btnCancelOrder = `
            <div class="cancel-order d-flex justify-content-end" data-id="${data.id}">
                <button type="button">Hủy</button>
            </div>
            `;
        }
        if (data.paymentMethod === "vnpay" && data.paymentStatus === "Unpaid") {
            btnPayment = `
            <div class="payment-order d-flex justify-content-end" data-id="${data.id}">
                <button type="button">Thanh toán</button>
            </div>
            `;
        }
        if (data.valueCoupon !== null) {
            coupon = `
            <div class="info-user-coupon">
                Giảm:
                <span id="coupon">${data.valueCoupon.toLocaleString()}đ</span>
            </div>
            `;
        }
        return `
        <div class="order-info-user col-lg-4">
            <div class="order-info-container">
                <div class="order-info-user-heading">Thông tin khách hàng</div>
                <div class="order-info-user-body">
                    <div class="info-user">
                        <div class="info-order-code">
                            Mã đơn hàng:
                            <span id="order-code">#${data.id}</span>
                        </div>
                        <div class="info-user-name">
                            Họ và tên:
                            <span id="name">${data.username}</span>
                        </div>
                        <div class="info-user-phone">
                            Số điện thoại:
                            <span id="phone">${data.phone}</span>
                        </div>
                        <div class="info-user-create">
                            Ngày đặt:
                            <span id="create">${data.createdDate}</span>
                        </div>
                        <div class="info-user-payment">
                            Thanh toán:
                            <span id="payment">${data.paymentMethod.toUpperCase()}</span>
                        </div>
                        <div class="info-user-payment">
                            Trạng thái thanh toán:
                            <span id="payment">${vietnamese.get(data.paymentStatus)}</span>
                        </div>
                        <div class="info-user-address">
                            Địa chỉ:
                            <span id="address">${data.address}</span>
                        </div>
                        ${coupon}
                        <div class="info-user-subtotal">
                            Tổng:
                            <span id="subtotal">${data.totalPricesOrder.toLocaleString()}đ</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            ${btnPayment}
                            ${btnCancelOrder}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    btnCancelOrder() {
        let btn = document.querySelector(".cancel-order");
        if (!btn) return;
        btn.addEventListener("click", () => {
            this.showConfirmationPopup(async (confirmed) => {
                if (confirmed) {
                    let id = btn.getAttribute("data-id");
                    await order.cancelOrderFromUser(id).then(() => window.location.reload());
                }
            })
        })
    }

    btnPaymentOrder() {
        let btn = document.querySelector(".payment-order");
        btn.addEventListener("click", async () => {
            let orderId = btn.getAttribute("data-id");
            await order.createPaymentVnPay(orderId)
                .then(paymentData => {
                    console.log(paymentData);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
        });
    }

    showConfirmationPopup(callback) {
        const confirmed = confirm("Bạn xác nhận muốn hủy đơn hàng ?");
        callback(confirmed);
    }

    async getHtml() {
        const id = this.params.id;
        const data = await order.getOrderDetailFromUser(id).then(response => {
            return response.status === 200 ? response.data : response.message;
        });
        const orderInfoUser = this.renderOrderInfoUser(data);
        let orderItems = data.orderItems;
        let containerOrderItems = orderItems.map(order => this.renderTableOrderItem(order)).join('');
        return `
        <div class="page-custom">
            <div class="order-detail-container row d-flex justify-content-evenly">
                <div class="heading">
                    <a href="/profile"><i class="fa-solid fa-circle-left"></i></a>
                    <span class="title-heading">Chi tiết đơn hàng</span>
                </div>
                <div class="order-detail-wrap col-lg-7">
                    <div class="order-detail-body">
                        <table class="table table-responsive">
                            <thead class="table-warning text-center">
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${containerOrderItems}
                            </tbody>
                        </table>
                    </div>
                </div>
                ${orderInfoUser}
            </div>
        </div>
        `;
    }

    funcForPage() {
        this.btnCancelOrder();
        this.btnPaymentOrder();
    }
}