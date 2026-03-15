import axios from 'axios';
const API_URL = "http://localhost:8080/api/courses";
// const API_URL = `${import.meta.env.BASE_URL}/api/courses`;

class CourseService {

    // 取得 JWT Header
    getAuthHeader() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            return { Authorization: user.token };
        } else {
            return {};
        }
    }

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
        return axios.get(API_URL + '/instructor/' + _instructor_id, {
            headers: this.getAuthHeader()
        });
    }

    // 建立新課程(限講師)
    postNewCourse(title, description, price) {
        return axios.post(API_URL,
            { title, description, price },
            { headers: this.getAuthHeader() }
        );
    }

    /**
     * 根據學生ID取得該學生已購買的課程(需驗證)
     * @param {string} _student_id 
     */
    getStudentCourses(_student_id) {
        return axios.get(API_URL + '/student/' + _student_id, {
            headers: this.getAuthHeader()
        });
    }

    // 讓學生透過課程id來註冊新課程(需驗證)
    enrollCourse(_id) {
        return axios.post(API_URL + '/enroll/' + _id, {}, {
            headers: this.getAuthHeader()
        });
    }
}

export default new CourseService();