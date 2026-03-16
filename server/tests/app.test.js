// 這是一個簡單的後端測試範例
// 使用 supertest 可以模擬 HTTP 請求來測試你的 Express 路由
const request = require('supertest');

// 假設你的 express app 被匯出在 index.js 中 (module.exports = app;)
// const app = require('../index'); 

describe('Server Basic Test Suite', () => {
    
    // 1. 基本的邏輯測試 (Sanity Check)
    it('should pass a basic logic test', () => {
        expect(1 + 1).toBe(2);
    });

    // 2. 假設的 API 測試 (請根據你實際的 Route 修改並取消註解)
    /*
    it('should return 200 on GET /', async () => {
        const response = await request(app).get('/');
        // 預期狀態碼為 200
        expect(response.statusCode).toBe(200);
    });
    */

    // 3. 測試課程模型的驗證邏輯或路由
    /*
    it('should block unauthorized access to courses', async () => {
        const response = await request(app).post('/api/courses').send({
            title: 'New Course',
            description: 'Course description'
        });
        // 預期沒有提供 JWT token 時會回傳 401 Unauthorized
        expect(response.statusCode).toBe(401);
    });
    */
});