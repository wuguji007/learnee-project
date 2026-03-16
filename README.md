# LEARNEE - 線上課程學習平台

全端線上學習平台，提供講師與學生互動的數位學習環境。系統具備雙角色權限管理，包含身份驗證、雙重角色系統、課程發布與註冊管理等功能。採用前後端分離架構，並完全基於 MERN Stack (MongoDB, Express.js, React, Node.js) 生態系打造，且針對 XSS 與 CSRF 進行了嚴謹的安全防護設置。

# 專案架構

```
learnee-project/
├── client/                 # 前端應用 (React + Tailwind CSS)
│   ├── public/             # 靜態資源
│   └── src/                # 前端原始碼
│       ├── components/     # UI 元件與頁面
│       ├── layouts/        # 共同佈局 (Header, Footer)
│       ├── services/       # API 請求服務 (Auth, Course)
│       └── tests/          # 前端單元測試
├── server/                 # 後端 API 服務 (Node.js + Express)
│   ├── config/             # 設定檔 (Passport JWT 認證)
│   ├── models/             # Mongoose 資料庫模型
│   ├── routes/             # API 路由
│   └── tests/              # 後端單元/整合測試
└── .github/workflows/      # CI/CD 自動化工作流程設定
```

## 技術

### 後端

框架: Express.js

資料庫: MongoDB

ORM: Mongoose

認證: Passport.js (JWT JSON Web Token)

資料驗證: Joi

測試: Jest, Supertest

### 前端

框架: React (Create React App)

路由: React Router DOM

UI 樣式: Tailwind CSS

輪播組件: Swiper

HTTP 客戶端: Axios

測試: Jest, React Testing Library

### 基礎設施

運行環境: Node.js

CI/CD: GitHub Actions

## 快速開始

### 環境需求
- Node.js (建議 v16 以上)
- MongoDB (本地端運行或 MongoDB Atlas)

### 1. 取得專案代碼

```bash
git clone [https://github.com/wuguji007/learnee-project.git](https://github.com/wuguji007/learnee-project.git)
cd learnee-project
```

### 2. 後端環境設定與啟動

# 進入後端目錄並安裝依賴

```bash
cd server
npm install
```

# 建立環境變數設定
# 建立 .env 檔案並設定以下內容：
# PORT=8080
# MONGODB_URI=mongodb://localhost:27017/learnee
# JWT_SECRET=your_jwt_secret_key_here

# 啟動開發伺服器

```bash
npm run dev

```
# 或啟動生產環境: npm start


### 3. 前端環境設定與啟動

# 開啟新終端機，進入前端目錄並安裝依賴
cd client
npm install

# 啟動開發伺服器
npm start


## 專案結構細節

### 後端結構

```
server/
├── index.js              # 應用程式進入點與 Express 全域設定
├── validation.js         # Joi 請求資料驗證邏輯
├── models/
│   ├── user-model.js     # 使用者資料結構 (包含密碼雜湊邏輯)
│   └── course-model.js   # 課程資料結構 (關聯 Instructor ID)
└── routes/
    ├── auth.js           # 註冊、登入 API
    └── course.js         # 課程 CRUD、註冊課程 API (受 JWT 保護)
```

### 前端結構

```
client/src/
├── App.js                # 路由配置與全域狀態管理
├── services/
│   ├── auth.service.js   # 處理登入、註冊與 Token 存儲 (LocalStorage)
│   └── course.service.js # 處理課程資料獲取與更新
└── components/
    ├── Login/Register    # 身分驗證元件
    ├── Home-component    # 首頁展示 (使用 Swiper 輪播)
    ├── Course-component  # 課程瀏覽清單
    ├── PostCourse-component # 講師發布課程表單
    └── *-dashboard       # 針對不同角色客製化的儀表板
```


常見問題排解 (Troubleshooting)

問題 1: 連線到後端 API 失敗 (CORS 錯誤)
# 檢查前端 API 基礎路徑
# 確認 client/src/services 中的 API URL 是否指向正確的 http://localhost:8080

問題 2: MongoDB 連線失敗
# 檢查本地端 MongoDB 服務狀態 (以 Mac 為例)
brew services info mongodb-community
# 若使用 MongoDB Atlas，請確認白名單 IP 是否已設定為開放
# 檢查 server/.env 中的 MONGODB_URI 格式是否正確


問題 3: 登入後無法獲取個人資料 / 課程發布失敗
# 這通常是因為 JWT Token 遺失或過期
# 請清除瀏覽器的 LocalStorage，重新整理網頁並再次登入
# 檢查後端終端機是否有顯示 Token 驗證失敗的錯誤訊息
