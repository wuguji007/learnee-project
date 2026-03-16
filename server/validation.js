const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(6).max(60).required().email(),
        password: Joi.string().min(6).max(120).required(),
        role: Joi.string().valid('student', 'instructor').required(),
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(60).required().email(),
        password: Joi.string().min(6).max(120).required(),
    });
    return schema.validate(data);
};

const courseValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(6).max(100).required(),
        price: Joi.number().min(10).max(9999).required(),
        category: Joi.string().required(),
        status: Joi.string().valid('上架', '未上架'), // 限制狀態只能是這兩個字串 (非必填，因預設值)
        chapters: Joi.array(), // 驗證必須為陣列型別(非必填，因有預設值)
    });
    return schema.validate(data);
};

// Named Exports (瑞士刀)
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
