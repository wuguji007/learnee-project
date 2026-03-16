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


// 連結到MongoDB
mongoose
    .connect("mongodb://localhost:27017/mernDB")
    .then(() => {
        console.log("Connected to MongoDB...");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });


    
// CORS設定
app.use(cors({
    origin: "http://localhost:3000", // 必須明確指定前端網址，不能用 '*'
    credentials: true,               // 允許前後端傳遞cookie
}));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 路由模組
app.use('/api/user', authRoute);
// course route要經過jwt驗證，如果request header沒有token或token無效，則request為unauthorized
// passport.authenticate() 為jwt的middleware
app.use('/api/courses', passport.authenticate('jwt', {session: false}), courseRoute);


app.listen(port, () => {
    console.log(`伺服器正運行在port ${port}...`);
})





