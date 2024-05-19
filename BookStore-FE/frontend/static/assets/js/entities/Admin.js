export default class Admin {
    async getAllUsers(page = 1) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = "http://localhost:8080/api/v1/admin/get-all-users?pageNo=" + page;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllOrders(page = 1) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = "http://localhost:8080/api/v1/admin/get-all-orders?pageNo=" + page;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllBooks(page = 1) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = "http://localhost:8080/api/v1/admin/get-all-books?pageNo=" + page;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    async changeOrderStatus(orderId, status) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url =
                `http://localhost:8080/api/v1/admin/change-order-status?orderId=${orderId}&status=${encodeURIComponent(status)}`;
            const response = await axios.put(url, null, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addNewBook(form) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/add-new-book`;
            const response = await axios.post(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateBook(form) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/add-new-book`;
            const response = await axios.post(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async changeImgBook(id, body) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/change-img-book?bookId=${id}`;
            const response = await axios.post(url, body, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Image");
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async adminGetOrder(orderId) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/admin-get-order/${orderId}`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async removeBook(id) {
        try {
            const url = `http://localhost:8080/api/v1/admin/change-status-book?id=${id}&status=Remove`;
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.put(url, null, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Successfully removed");
            return response.data;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async countOrders() {
        try {
            const url = "http://localhost:8080/api/v1/admin/count-orders";
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getTotalsPriceInYear(year) {
        try {
            const url = `http://localhost:8080/api/v1/admin/getTotalPriceInYear/${year}`;
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });
            console.log(response.data);
            return response.data;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getTotalsPriceByRange(start, end) {
        try {
            const url =
                `http://localhost:8080/api/v1/admin/getTotalPricesByRange?startDate=${start}&endDate=${end}`;
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });
            console.log(response);
            return response.data;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getUserByEmail(email) {
        try {
            const url = `http://localhost:8080/api/v1/admin/find-user/${email}`;
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });
            return response.data;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async importExcel(file) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/excel/new-books`;
            const response = await axios.post(url, file, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + token
                }
            });
            return response.data;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async exportExcel() {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/book/down`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });
            return response;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getOrdersByStatus(status, page) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/get-orders-by-status/${status}/${page}`;
            const response = await axios.get(url, {
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

    async getListUsersByRole(pageNo = 1, role) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/get-users-by-role?pageNo=${pageNo}&role=${role}`;
            const response = await axios.get(url, {
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

    async lockedAccount(email, status) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/locked-account?email=${email}&locked=${status}`;
            const response = await axios.get(url, {
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

    async createAccountAdmin(request) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = `http://localhost:8080/api/v1/admin/create-acc-admin`;
            const response = await axios.post(url, request, {
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