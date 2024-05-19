export default class Coupon {
    async createNewCoupon(coupon) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = 'http://localhost:8080/api/v1/admin/create-new-coupon';
            const response = await axios.post(url, coupon, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            return e.response.data;
        }
    }

    async getAllCoupons(pageNo = 1, pageSize = 10) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/get-all-coupons?pageNo=${pageNo}&pageSize=${pageSize}`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            throw new Error(e);
        }
    }

    async getOneCoupon(name) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/get-one-coupon/${name}`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            throw new Error(e);
        }
    }

    async getValidCoupon() {
        try {
            const url = `http://localhost:8080/api/v1/book/get-coupon-valid`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (e) {
            throw new Error(e);
        }
    }

    async updateCoupon(coupon) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/update-coupon`;
            const response = await axios.post(url, coupon, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            throw new Error(e);
        }
    }

    async checkUseCoupon(coupon, totalPrice) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/user/check-used-coupon?coupon=${coupon}&totalPrice=${totalPrice}`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            throw new Error(e);
        }
    }

    renderCoupon(item) {
        return `
        <div class="coupon">
            <div class="coupon-heading">NHẬP MÃ:
                <input type="text" class="coupon-name" disabled value="${item.name}">
            </div>
            <div class="coupon-body d-flex flex-column">
                <span>- ${item.description}</span>
                <span>- Mã giảm tối đa ${item.valueCoupon.toLocaleString()}đ</span>
                <span>- Có hiệu lực đến ngày ${item.expiredDate}</span>
            </div>
            <div class="coupon-copy">
                <button type="button">
                    <span>Sao chép</span>
                </button>
            </div>
        </div>
        `;
    }
}