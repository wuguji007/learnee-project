import axios from 'axios';
// const API_URL = "http://localhost:8080/api/user";
const BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const API_URL = `${BASE}/api/user`;

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
        return axios.post(API_URL + '/login', { email, password })
            .then((response) => {
                // 後端只傳回user資訊，token已自動存在cookie中
                if (response.data.user) {
                    // 只存取使用者資訊(不存token)
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    // 登出API
    logout() {
        localStorage.removeItem("user");
        // 呼叫後端API清除cookie
        return axios.post(API_URL + "/logout");
    }

    // 取得登入會員data
    getCurrentUser() {
        const userStr = localStorage.getItem("user");

        // null || 字串 "undefined"，都當作沒有登入
        if (!userStr || userStr === "undefined") {
        return null;
        }
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("解析 LocalStorage 使用者資料時發生錯誤：", error);
            return null;
        }
        // return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();

