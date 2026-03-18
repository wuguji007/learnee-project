// 主入口：tab state 管理、角色路由到 StudentDashboard / InstructorDashboard
// 共用：ProfileHeader、背景 grid overlay、未登入提示
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import CourseService from "../services/course.service";
import { ProfileHeader } from "./profile-shared";
import StudentDashboard from "./Student-dashboard";
import InstructorDashboard from "./Instructor-dashboard";


const ProfileComponent = ({ currentUser }) => {
  const isInstructor = currentUser?.user?.role === "instructor";

  // 學生 tab / filter state
  const [studentTab, setStudentTab]     = useState("courses");
  const [courseFilter, setCourseFilter] = useState("all");

  // 講師 tab / courses state
  const [instructorTab, setInstructorTab]                   = useState("courses");
  const [instructorCourses, setInstructorCourses]           = useState([]);
  const [instructorCoursesCount, setInstructorCoursesCount] = useState(0);

  // 講師初始 fetch
  useEffect(() => {
    if (!isInstructor || !currentUser?.user?._id) return;
    CourseService.getInstructorCourses(currentUser.user._id)
      .then(res => {
        const data = res.data || [];
        setInstructorCourses(data);
        setInstructorCoursesCount(data.length);
      })
      .catch(console.error);
  }, [isInstructor]);

  const handleCourseCreated = (newCourse) => {
    if (!newCourse) return;
    setInstructorCourses(prev => [newCourse, ...prev]);
    setInstructorCoursesCount(prev => prev + 1);
  };

  // 未登入
  if (!currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Users size={28} className="text-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-700 mb-2">尚未登入</h2>
        <p className="text-sm text-gray-400">請先登入會員以查看個人檔案</p>
      </motion.div>
    );
  }

  const activeTab = isInstructor ? instructorTab : studentTab;

  const handleTabChange = (tab) => {
    if (isInstructor) {
      setInstructorTab(tab);
    } else {
      setStudentTab(tab);
      setCourseFilter("all");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 背景網格 */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.025) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.025) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
        }}
      />

      <div className="relative z-10">
        {/* 共用 ProfileHeader */}
        <ProfileHeader
          user={currentUser?.user}
          isInstructor={isInstructor}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          coursesCount={instructorCoursesCount}
        />

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {isInstructor ? (
                <InstructorDashboard
                  currentUser={currentUser}
                  activeTab={instructorTab}
                  courses={instructorCourses}
                  onCourseCreated={handleCourseCreated}
                />
              ) : (
                <StudentDashboard
                  activeTab={studentTab}
                  courseFilter={courseFilter}
                  onCourseFilterChange={setCourseFilter}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
