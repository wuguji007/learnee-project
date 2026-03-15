const router = require('express').Router();
const Course = require('../models').course;
const courseValidation = require('../validation').courseValidation;


router.use((req, res, next) => {
    console.log('正在接收course相關請求...');
    next();
});


// 取得所有課程API
router.get('/', async (req, res) => {
    try {
        // 使用.populate()方法將課程的instructor欄位從ObjectId轉換為對應的user document ，取出講師的username和email欄位
        const allCourse = await Course.find({}).populate('instructor', ["username", "email"]).exec();
        return res.send(allCourse);
    } catch (error) {
        console.error('取得所有課程失敗:', error);
        return res.status(500).json({ status: 'error', message: '取得所有課程失敗...' });
    }
});


// 用課程id取得課程API
router.get('/:_id', async (req, res) => {
    const { _id } = req.params;
    try {
        const foundCourse = await Course
            .findOne({ _id })
            .populate('instructor', ["username", "email"])
            .exec();
        console.log('成功取得課程資訊', foundCourse);
        return res.send(foundCourse);
    } catch (error) {
        console.error('取得課程失敗...', error);
        return res.status(500).json({ status: 'error', message: '取得課程失敗...' });
    }
})


/* --------------- APIs for Instructor --------------- */
// 新增課程API
router.post('/', async (req, res) => {

    // 驗證資料是否符合規範
    const { error } = courseValidation(req.body);
    if (error) {
        return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    // 驗證身份，使用user-model的instance method: isStudent()
    if (req.user.isStudent()) {
        return res.status(400).send('只有講師身份才能新增課程，請使用講師帳號登入');
    }

    // 建立新課程
    const { title, description, price } = req.body;
    try {
        const newCourse = new Course({
            title,
            description,
            price,
            instructor: req.user._id,  // 從req.user中取得講師的ID，這是passport驗證成功後附加在req物件上的使用者資訊
        });
        const savedCourse = await newCourse.save();
        console.log('課程新增成功', savedCourse);
        return res.status(200).json({ status: 'success', message: '課程新增成功', savedCourse });
    } catch (error) {
        console.error('新增課程失敗:', error);
        return res.status(500).json({ status: 'error', message: '新增課程失敗...' });
    }
});


// 編輯課程API
router.patch('/:_id', async (req, res) => {
    // 驗證資料是否符合規範
    const { error } = courseValidation(req.body);
    if (error) {
        console.log('資料不符合規範', error.details[0].message);
        return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    const { _id } = req.params;
    try {
        // 驗證課程是否存在
        const foundCourse = await Course.findOne({ _id }).exec();
        if (!foundCourse) {
            console.log('找不到此課程');
            return res.status(404).json({ status: 'error', message: '找不到此課程' });
        }

        // 驗證是否為該課程講師，才能編輯課程
        if (foundCourse.instructor.equals(req.user._id)) {
            let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, { new: true, runValidators: true });
            console.log('課程編輯成功!', updatedCourse);
            return res.status(200).json({ status: 'success', message: '課程編輯成功!', updatedCourse });
        } else {
            console.log('只有此課程講師才能編輯課程');
            return res.status(403).send('只有此課程講師才能編輯課程');
        }
    } catch (error) {
        return res.status(500).json({ status: 'error', message: '編輯課程失敗...' });
    }
});


// 刪除課程API
router.delete('/:_id', async (req, res) => {
    const { _id } = req.params;
    try {
        // 驗證課程是否存在
        const foundCourse = await Course.findOne({ _id }).exec();
        if (!foundCourse) {
            console.log('找不到此課程');
            return res.status(404).json({ status: 'error', message: '找不到此課程' });
        }

        // 驗證是否為該課程講師，才能編輯課程
        if (foundCourse.instructor.equals(req.user._id)) {
            let deletedCourse = await Course.deleteOne({ _id }).exec();
            console.log('課程刪除成功!', deletedCourse);
            return res.status(200).json({ status: 'success', message: '課程刪除成功!', deletedCourse });
        } else {
            console.log('只有此課程講師才能刪除課程');
            return res.status(403).send('只有此課程講師才能刪除課程');
        }
    } catch (error) {
        return res.status(500).json({ status: 'error', message: '刪除課程失敗...' });
    }
});




module.exports = router;