import axios from 'axios';
const API_URL = "http://localhost:8080/api/courses";
// const API_URL = `${import.meta.env.BASE_URL}/api/courses`;

class CourseService {

    // 取得 JWT Header >> 使用cookie
    // getAuthHeader() {
    //     const user = JSON.parse(localStorage.getItem("user"));
    //     if (user && user.token) {
    //         return { Authorization: user.token };
    //     } else {
    //         return {};
    //     }
    // }

    //取得所有課程資料(公開)
    getAllCourses() {
        return axios.get(API_URL);
    }

    //根據課程名稱取得課程
    getCourseByName(name) {
        return axios.get(API_URL + "/findByName/" + name);
    }

    /**
     * 根據講師ID取得該講師所有課程(需驗證)
     * @param {string} _instructor_id 
     */
    getInstructorCourses(_instructor_id) {
        // return axios.get(API_URL + '/instructor/' + _instructor_id, {
        //     headers: this.getAuthHeader()
        // });
        return axios.get(API_URL + '/instructor/' + _instructor_id);
    }

    // 建立新課程(限講師)
    postNewCourse(title, description, price, category, status, chapters) {
        return axios.post(API_URL,
            { title, description, price, category, status, chapters }
        );
    }

    /**
     * 編輯課程（限該課程講師）
     * @param {string} _id       課程 MongoDB ObjectId
     * @param {object} payload   { title, description, price, category, status, chapters }
     */
    updateCourse(_id, payload) {
        return axios.patch(API_URL + '/' + _id, payload);
    }
 
    /**
     * 刪除課程（限該課程講師）
     * @param {string} _id  課程 MongoDB ObjectId
     */
    deleteCourse(_id) {
        return axios.delete(API_URL + '/' + _id);
    }


    /**
     * 根據學生ID取得該學生已購買的課程(需驗證)
     * @param {string} _student_id 
     */
    getStudentCourses(_student_id) {
        return axios.get(API_URL + '/student/' + _student_id);
    }

    // 讓學生透過課程id來註冊新課程(需驗證)
    enrollCourse(_id) {
        return axios.post(API_URL + '/enroll/' + _id);
    }
}

export default new CourseService();