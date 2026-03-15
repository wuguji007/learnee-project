import axios from 'axios';
const API_URL = "http://localhost:8080/api/user";
// const API_URL = `${import.meta.env.BASE_URL}/api/user`;

class AuthService {

    // 註冊API
    register(username, email, password, role) {
        return axios.post(API_URL + '/register', {
            username,
            email,
            password,
            role
        });
    }

    // 登入API
    login(email, password) {
        return axios.post(API_URL + '/login', { email, password });
    }

    // 登出API
    logout() {
        localStorage.removeItem("user");
    }

    // 取得登入會員data
    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();

