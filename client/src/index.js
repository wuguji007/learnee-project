import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';


// 全域設定 - Axios在跨網域請求時自動帶上cookie
axios.defaults.withCredentials = true;

// 加入Axios攔截器Response Interceptor
axios.interceptors.response.use(
  (response) => {
    // 如果請求成功，就直接回傳response
    return response;
  },
  (error) => {
    // 如果發生錯誤，檢查HTTP狀態碼
    if (error.response && error.response.status === 401) {
      console.warn("憑證過期或無效，自動登出中...");
      
      // 清除本地的使用者資訊
      localStorage.removeItem("user");
      
      // 判斷當前頁面，如果不是在登入頁，就強制導向登入頁
      if (window.location.pathname !== '/login') {
        window.alert("登入逾時，請重新登入！");
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
