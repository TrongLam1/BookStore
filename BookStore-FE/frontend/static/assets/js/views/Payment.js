import Abstract from './AbstractView.js'
import Order from '../entities/Order.js'

const order = new Order();

export default class Payment extends Abstract {
    constructor(params) {
        super(params);
        this.setTitle("Payment");
    }

    async getHtml() {
        const data = order.getLatestOrder();
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
                        <span>Banking</span>
                    </div>
                    <div class="payment-item">
                        <span>Khách hàng:</span>
                        <span>Nguyễn Văn A</span>
                    </div>
                    <div class="payment-item">
                        <span>Số điện thoại:</span>
                        <span>0123456789</span>
                    </div>
                    <div class="payment-item payment-amount">
                        <span>Số tiền:</span>
                        <span>50.000đ</span>
                    </div>
                    <div class="payment-item">
                        <span>Mã giao dịch:</span>
                        <span>129</span>
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