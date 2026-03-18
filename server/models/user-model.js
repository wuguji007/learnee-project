const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 60,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 120,
    },
    role: {
        type: String,
        enum: ['student', 'instructor'],
        required: true,
    },
    avatar: {
        type: String, default: '',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


// Instance methods
userSchema.methods.isStudent = function () {
    return this.role === 'student';
}

userSchema.methods.isInstructor = function () {
    return this.role === 'instructor';
}

// 比對密碼
userSchema.methods.comparePassword = async function (password, cb) {
    let result;
    try {
        result = await bcrypt.compare(password, this.password);
        return cb(null, result); // 兩種結果，密碼正確result為true，密碼錯誤result為false
    } catch (e) {
        return cb(e, result);  // compare錯誤跳到這裡，result為undefined
    }
};

// 新用戶或修改密碼時進行密碼雜湊處理
// this 指向即將儲存的 user document
// 注意：使用 async function 時，不要傳入 next 參數
userSchema.pre('save', async function () {
    if (this.isNew || this.isModified('password')) {
        const hashValue = await bcrypt.hash(this.password, 10);
        this.password = hashValue;
    }
    // 注意：在 async 函式中，不需要呼叫 next()，Promise resolve 時 Mongoose 會自動繼續執行
});


module.exports = mongoose.model('User', userSchema);