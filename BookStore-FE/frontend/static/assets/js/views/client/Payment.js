import Abstract from '../AbstractView.js'
import Order from '../../entities/Order.js'

const order = new Order();

export default class Payment extends Abstract {
    constructor(params) {
        super(params);
        this.setTitle("Payment");
    }

    async getHtml() {
        const response = await order.getLatestOrder();
        const data = response.data;
        console.log(data);
        return `
        <div class="payment-success-container">
            <div class="payment-success-wrap">
                <div class="payment-success-heading">
                    <div class="success-icon">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div class="success-title">
                        Thanh toán thành công
                    </div>
                </div>
                <div class="payment-success-body">
                    <div class="payment-item">
                        <span>Phương thức thanh toán:</span>
                        <span>${data.paymentMethod.toUpperCase()}</span>
                    </div>
                    <div class="payment-item">
                        <span>Thời gian thanh toán:</span>
                        <span>${data.paymentDate}</span>
                    </div>
                    <div class="payment-item">
                        <span>Khách hàng:</span>
                        <span>${data.username}</span>
                    </div>
                    <div class="payment-item">
                        <span>Số điện thoại:</span>
                        <span>${data.phone}</span>
                    </div>
                    <div class="payment-item payment-amount">
                        <span>Số tiền:</span>
                        <span>${data.totalPricesOrder.toLocaleString()}đ</span>
                    </div>
                    <div class="payment-item">
                        <span>Mã giao dịch:</span>
                        <span>${data.paymentCode}</span>
                    </div>
                </div>
                <div class="payment-success-footer">
                    <a href="/">Trở về trang chủ</a>
                </div>
            </div>
        </div>
        `;
    }
}