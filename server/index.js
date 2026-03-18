const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const passport = require('passport');
require('./config/passport')(passport);  // 執行passport設定檔，並將實例傳入進行初始化設定
const cookieParser = require("cookie-parser");


const authRoute = require('./routes').auth;
const courseRoute = require('./routes').course;

const port = process.env.PORT;

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running...' });
});



// 連結MongoDB：優先讀取環境變數，若無則退回本地資料庫
const MONGODB_URI = process.env.DB_CONNECT || "mongodb://localhost:27017/mernDB";
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB...");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// CORS設定：優先讀取環境變數，若無則退回本地的 3000 port
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
app.use(cors({
    origin: CLIENT_URL, 
    credentials: true,               // 允許前後端傳遞cookie
}));



// 連結到MongoDB
// mongoose
//     .connect("mongodb://localhost:27017/mernDB")
//     .then(() => {
//         console.log("Connected to MongoDB...");
//     })
//     .catch((error) => {
//         console.error("Error connecting to MongoDB:", error);
//     });

// CORS設定
// app.use(cors({
//     origin: "http://localhost:3000", // 必須明確指定前端網址，不能用 '*'
//     credentials: true,               // 允許前後端傳遞cookie
// }));

// Middleware

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 路由模組
app.use('/api/user', authRoute);
// 公開讀取路由(GET)不需要JWT，直接掛載courseRoute
// 需要身份驗證的路由(POST / PATCH / DELETE) --> course.js內各自套用passport.authenticate()
app.use('/api/courses', courseRoute);


app.listen(port, () => {
    console.log(`伺服器正運行在port ${port}...`);
})


module.exports = app;

