export default class Order {
    async getOrderById(id) {
        try {
            const url = "http://localhost:8080/api/v1/admin/find-order-id/" + id;
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.get(url, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    async placeOrder(request, coupon, valueCoupon) {
        try {
            let url = `http://localhost:8080/api/v1/user/place-order?coupon=${coupon.toUpperCase()}&valueCoupon=${valueCoupon}`;
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.post(url, request, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    async getHistoryOrdersFromUser(page = 1) {
        try {
            const url = `http://localhost:8080/api/v1/user/get-list-orders?pageNo=${page}&pageSize=10`;
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.get(url, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async getOrderDetailFromUser(orderId) {
        try {
            const url = `http://localhost:8080/api/v1/user/get-order/${orderId}`;
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.get(url, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async createPaymentVnPay(id) {
        try {
            const url =
                `http://localhost:8080/api/v1/payment/create_payment?orderId=${id}&orderInfo=Thanh-toan-don-hang`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            window.location.href = response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async getLatestOrder() {
        try {
            const url = "http://localhost:8080/api/v1/user/get-latest-order"
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async cancelOrderFromUser(id) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/user/update-order-status/${id}/Cancel`;
            const response = await axios.put(url, null, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            throw new Error();
        }
    }
}