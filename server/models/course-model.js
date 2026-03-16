const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    id: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId, // primary key
        ref: 'User',
    },
    students: {
        type: [String],
        default: [],
    },
    //擴增三欄位
    category: {
        type: String,
        required: true, 
    },
    status: {
        type: String,
        enum: ['上架', '未上架'], // 限制只能傳入這兩個值
        default: '未上架',       // 預設為未上架
    },
    chapters: {
        type: Array, 
        default: [],
    },
});

module.exports = mongoose.model('Course', courseSchema);
