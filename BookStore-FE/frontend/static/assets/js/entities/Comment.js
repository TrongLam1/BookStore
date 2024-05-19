export default class Comment {
    async postCommentByUser(productId, commentRequest) {
        try {
            const url = `http://localhost:8080/api/v1/user/post-comment/${productId}`;
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.post(url, commentRequest, {
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

    async getListCommentsFromBook(productId, pageNo = 1) {
        try {
            const url = `http://localhost:8080/api/v1/book/get-list-comments-book/${productId}/${pageNo}`;
            const response = await axios.get(url, {
                header: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getAverageRating(productId) {
        try {
            const url = `http://localhost:8080/api/v1/book/get-average-rating/${productId}`;
            const response = await axios.get(url, {
                header: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }
}