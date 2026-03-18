import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';


// 全域設定 - Axios在跨網域請求時自動帶上cookie
axios.defaults.withCredentials = true;


// 公開 API 白名單：這些路徑收到 401 屬訪客正常行為，不跳轉登入頁
const PUBLIC_API_PREFIXES = [
  '/api/courses',   // 課程列表、詳情、搜尋（訪客可瀏覽）
];
const isPublicApi = (url = '') =>
  PUBLIC_API_PREFIXES.some(prefix => url.includes(prefix));
 

// Axios攔截器Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status     = error.response?.status;
    const requestUrl = error.config?.url ?? '';
 
    if (status === 401) {
      // 公開API的401 --> 一般訪客，忽略不跳轉
      if (isPublicApi(requestUrl)) {
        return Promise.reject(error);
      }
 
      // 受保護API的401 --> token過期，清除資料並跳轉登入頁
      console.warn('憑證過期或無效，自動登出中...');
      localStorage.removeItem('user');
 
      if (window.location.pathname !== '/login') {
        window.alert('登入逾時，請重新登入！');
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
