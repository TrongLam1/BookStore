export default class UserEntity {
    static get getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}