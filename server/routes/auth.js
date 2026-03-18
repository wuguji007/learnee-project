const router = require('express').Router();
const User = require('../models').user;
const registerValidation = require('../validation').registerValidation;
const loginValidation = require('../validation').loginValidation;
const jwt = require('jsonwebtoken');


router.use((req, res, next) => {
    console.log('正在接收auth相關請求...');
    next();
});

// 測試API
router.get('/testAPI', (req, res) => {
    res.send('成功連結auth route!');
});

// 註冊API
router.post('/register', async (req, res) => {
    
    // 驗證資料是否符合規範
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    // 檢查信箱是否已被註冊
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
        console.log('註冊失敗，信箱已被註冊過', req.body.email);
        return res.status(400).json({ status: 'error', message: '信箱已被註冊過' });
    }

    // 建立新用戶
    const { username, email, password, role } = req.body;
    const newUser = new User({ username, email, password, role });

    try {
        const savedUser = await newUser.save();
        console.log('新用戶註冊成功', savedUser);
        return res.status(201).json({ status: 'success', message: '註冊成功!', savedUser });
    } catch (err) {
        console.error('註冊失敗', err);
        return res.status(500).json({ status: 'error', message: '註冊失敗...' });
    }
});


// 登入API
router.post('/login', async (req, res) => {
    // 驗證資料
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    // 檢查帳號是否存在
    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) {
        console.log('登入失敗，此帳號不存在');
        return res.status(401).json({ status: 'error', message: '此用戶不存在' });
    }

    // 驗證密碼，使用 user-model 的 comparePassword method
    userExists.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
            console.log('登入失敗', err);
            return res.status(500).json({ status: 'error', message: '登入失敗...' });
        }
        if (!isMatch) {
            console.log('登入失敗，密碼錯誤');
            return res.status(401).json({ status: 'error', message: '密碼錯誤...' });
        }

        // 登入成功，簽發 JWT
        if (isMatch) {
            //建立payload
            const tokenObject = { _id: userExists._id, email: userExists.email };
            // 加密簽署，生成token
            const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
            console.log('登入成功，已簽發Token:', token);


            // 將token放入cookie
            res.cookie("jwt", token, {
            httpOnly: true,  // 禁止前端JS讀取，防XSS
            secure: true, 
            sameSite: none, 
            maxAge: 1000 * 60 * 60 * 24, // 1 天有效
            });


            // res.cookie("jwt", token, {
            // httpOnly: true,  // 禁止前端JS讀取，防XSS
            // secure: process.env.NODE_ENV === "production", // 生產環境需HTTPS才開啟
            // sameSite: "Lax", // 防禦CSRF攻擊
            // maxAge: 1000 * 60 * 60 * 24, // 1 天有效
            // });


            return res.status(200).json({
                status: 'success',
                message: '登入成功!',
                token: 'JWT ' + token,  // 注意：'JWT '是passport-jwt預設的token前綴，記得要留一個空白鍵，不然會報錯
                user: userExists
            });
        } else {
            return res.status(401).json({ status: 'error', message: '登入失敗...' });
        }
    });
});


// 登出API(清除cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  return res.send({ success: true, message: "已登出" });
});

module.exports = router;