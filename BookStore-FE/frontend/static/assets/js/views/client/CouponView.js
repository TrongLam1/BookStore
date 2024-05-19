import AbstractView from '../AbstractView.js';
import Coupon from '../../entities/CouponEntity.js';
import Toast from '../Toast.js';

const coupon = new Coupon();
const toast = new Toast();

export default class CouponView extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Coupons');
    }

    copyCoupon() {
        let copyTexts = document.querySelectorAll(".coupon-copy button");

        copyTexts.forEach(item => {
            item.addEventListener("click", () => {
                let parentNode = item.parentNode.parentNode;
                let copyText = parentNode.querySelector(".coupon-name");

                copyText.select();
                copyText.setSelectionRange(0, 99999)
                // Copy the text inside the text field
                navigator.clipboard.writeText(copyText.value);

                // Alert the copied text
                toast.showSuccessToast("Đã copy coupon.");
            })
        })
    }

    async renderListCoupons() {
        let response = await coupon.getValidCoupon();
        let data = response.status === 200 ? response.data : [];
        let listCoupons = data.map(item => {
            return `<div class="coupon-item col-lg-4 ">
                ${coupon.renderCoupon(item) }
            </div>`
        }).join('');
        return `
        <div class="coupon-container d-flex">
            ${listCoupons}
        </div>
        `;
    }

    async getHtml() {
        let listCoupons = await this.renderListCoupons();
        return `
        <div class="page-custom product-detail-page">
            <div class="direction-page d-flex">
                <a href="/">Trang chủ</a>/
                <span>Danh sách coupon</span>
            </div>
            <div class="coupon-page">
                ${listCoupons}
            </div>
        </div>
        `;
    }

    async funcForPage() {
        this.copyCoupon();
    }
}