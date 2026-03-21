// supertest模擬HTTP請求測試Express路由
const request = require('supertest');

describe('Server Basic Test Suite', () => {
    
    // 基礎logic測試 (Sanity Check)
    it('should pass a basic logic test', () => {
        expect(1 + 1).toBe(2);
    });

    // 假設的 API 測試 (根據實際的Route修改並取消註解)
    /*
    it('should return 200 on GET /', async () => {
        const response = await request(app).get('/');
        // 預期狀態碼為 200
        expect(response.statusCode).toBe(200);
    });
    */

    // 測試課程模型的驗證邏輯或路由
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