export default class AuthenticationEntity {
    async postSignUp(username, email, password) {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/authen/sign-up',
                { username, email, password},
                {
                    headers: { 'Content-Type': 'application/json' }
                });
            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    }

    async postSignIn(email, password) {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/authen/sign-in', {
                email: email,
                password: password
            }, {
                headers: { 'Content-type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    }

    async sendOtp(email) {
        try {
            const url = 'http://localhost:8080/api/v1/authen/mail-reset-password?email=' + email;
            const response = await axios.post(url, null, {
                headers: { 'Content-type': 'application/json' }
            });
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    async resetPassword(request) {
        try {
            const url = 'http://localhost:8080/api/v1/authen/reset-pass';
            const response = await axios.post(url, request, {
                headers: { 'Content-type': 'application/json' }
            });
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    async logOut() {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = 'http://localhost:8080/api/v1/authen/log-out';
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    async changePassword(request) {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const url = 'http://localhost:8080/api/v1/authen/change-pass';
            const response = await axios.post(url, request, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    }
}