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

  // ── 學生 tab / filter state ──
  const [studentTab, setStudentTab]     = useState("courses");
  const [courseFilter, setCourseFilter] = useState("all");

  // ── 講師 tab / courses state ──
  const [instructorTab, setInstructorTab]                   = useState("courses");
  const [instructorCourses, setInstructorCourses]           = useState([]);
  const [instructorCoursesCount, setInstructorCoursesCount] = useState(0);

  // 講師初始 fetch（更新 Header badge 課程數）
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

        {/* 內容區 */}
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

// const CATEGORY_OPTIONS = [
//   "程式設計",
//   "拍攝剪輯",
//   "自我成長",
//   "藝術設計",
//   "數據分析",
//   "投資理財",
//   "音樂創作",
//   "烹飪料理",
//   "創意寫作",
//   "語言學習",
//   "其他",
// ];
 
// 課程預設image
// const CATEGORY_IMAGES = {
//   "程式設計": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
//   "拍攝剪輯": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
//   "自我成長": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
//   "藝術設計": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
//   "數據分析": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
//   "投資理財": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
//   "音樂創作": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
//   "其他":     "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
// };

// Mock Data 
// const STUDENT_COURSES = [
//   {
//     id: 2,
//     title: "小白也會！從零開始學習 Python 程式設計",
//     instructor: "Kelly Hsu",
//     price: 2480,
//     originalPrice: 3200,
//     rating: 4.0, reviews: 333, students: 420,
//     tags: ["程式開發"],
//     image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     avatar: "https://randomuser.me/api/portraits/women/65.jpg",
//     progress: 68, status: "in_progress"
//   },
//   {
//     id: 3,
//     title: "全面掌握 JavaScript 開發技術",
//     instructor: "Kelly Hsu",
//     price: 2480, originalPrice: 3200,
//     rating: 4.0, reviews: 333, students: 420,
//     tags: ["程式開發"],
//     image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     avatar: "https://randomuser.me/api/portraits/men/11.jpg",
//     progress: 20, status: "not_started"
//   },
//   {
//     id: 4,
//     title: "HTML & CSS 網頁設計基礎教程",
//     instructor: "Kelly Hsu",
//     price: 2480, originalPrice: 3200,
//     rating: 4.0, reviews: 333, students: 420,
//     tags: ["程式開發"],
//     image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//     progress: 100, status: "completed"
//   },
//   {
//     id: 9,
//     title: "更進一步！深入學習 Node.js 與後端開發",
//     instructor: "Kelly Hsu",
//     price: 2480, originalPrice: 3200,
//     rating: 4.0, reviews: 333, students: 420,
//     tags: ["程式開發"],
//     image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     progress: 0, status: "not_started"
//   }
// ];
 
// const BOOKMARKED_COURSES = [
//   {
//     id: 6,
//     title: "UI/UX 設計入門：打造令人愛不釋手的產品",
//     instructor: "Anny Lin",
//     price: 2880, originalPrice: 3600,
//     rating: 4.9, reviews: 748, students: 1205,
//     tags: ["藝術設計"],
//     image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     avatar: "https://randomuser.me/api/portraits/women/22.jpg"
//   },
//   {
//     id: 8,
//     title: "吉他從零開始：30 天學會你最愛的流行歌曲",
//     instructor: "K. Lee",
//     price: 1280, originalPrice: 1800,
//     rating: 4.8, reviews: 923, students: 2100,
//     tags: ["音樂創作"],
//     image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     avatar: "https://randomuser.me/api/portraits/men/32.jpg"
//   }
// ];



// 動畫Variants
// const fadeUp = {
//   hidden: { opacity: 0, y: 24 },
//   visible: (i = 0) => ({
//     opacity: 1, y: 0,
//     transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
//   })
// };
 
// const stagger = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.07 } }
// };
 
// 共用狀態元件
// const StatusBadge = ({ status }) => {
//   const map = {
//     "上架":      { label: "已上架",   color: "bg-emerald-100 text-emerald-600" },
//     "未上架":    { label: "未上架",   color: "bg-yellow-100 text-yellow-600" },
//     in_progress: { label: "進行中",   color: "bg-blue-100 text-blue-600" },
//     completed:   { label: "已完課",   color: "bg-emerald-100 text-emerald-600" },
//     not_started: { label: "等待開課", color: "bg-gray-100 text-gray-500" },
//   };
//   const s = map[status] || map["未上架"];
//   return (
//     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>
//       {s.label}
//     </span>
//   );
// };
 
// const ProgressBar = ({ value }) => (
//   <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
//     <motion.div
//       className="h-full bg-gradient-to-r from-[#0e9888] to-[#23a495] rounded-full"
//       initial={{ width: 0 }}
//       animate={{ width: `${value}%` }}
//       transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
//     />
//   </div>
// );
 

// 表單驗證Validation
// const validate = (fields) => {
//   const errors = {};
//   if (!fields.title?.trim())
//     errors.title = "課程名稱為必填";
//   else if (fields.title.trim().length < 5)
//     errors.title = "課程名稱至少 5 個字";
 
//   if (!fields.description?.trim())
//     errors.description = "課程介紹為必填";
//   else if (fields.description.trim().length < 10)
//     errors.description = "課程介紹至少 10 個字";
 
//   const price = Number(fields.price);
//   if (fields.price === "" || fields.price === undefined || fields.price === null)
//     errors.price = "課程金額為必填";
//   else if (isNaN(price) || price < 0)
//     errors.price = "請輸入有效金額";
//   else if (price > 200000)
//     errors.price = "課程金額上限為 NT$ 200,000";
 
//   if (!fields.category)
//     errors.category = "請選擇課程類別";
 
//   return errors;
// };
 

// 建立/編輯課程表單(Create || Patch)
// const EMPTY_FORM = {
//   title: "",
//   description: "",
//   price: "",
//   category: "",
//   status: "未上架",
//   chapters: [],
// };
 
// const CourseForm = ({ initial = null, onSubmit, onCancel, loading }) => {
//   const isEdit = !!initial;
 
//   const titleRef    = useRef(null);
//   const descRef     = useRef(null);
//   const priceRef    = useRef(null);
//   const categoryRef = useRef(null);
 
//   const [fields, setFields]   = useState(
//     isEdit
//       ? {
//           title: initial.title,
//           description: initial.description,
//           price: initial.price,
//           category: initial.category,
//           status: initial.status,
//           chapters: initial.chapters || [],
//         }
//       : { ...EMPTY_FORM }
//   );
//   const [errors, setErrors]   = useState({});
//   const [touched, setTouched] = useState({});
 
//   const set = (key, val) => {
//     setFields(f => ({ ...f, [key]: val }));
//     if (touched[key]) {
//       const e = validate({ ...fields, [key]: val });
//       setErrors(prev => ({ ...prev, [key]: e[key] }));
//     }
//   };
 
//   const blur = (key) => {
//     setTouched(t => ({ ...t, [key]: true }));
//     const e = validate(fields);
//     setErrors(prev => ({ ...prev, [key]: e[key] }));
//   };
 
//   const handleSubmit = () => {
//     const allTouched = Object.fromEntries(Object.keys(EMPTY_FORM).map(k => [k, true]));
//     setTouched(allTouched);
//     const e = validate(fields);
//     setErrors(e);
//     if (Object.keys(e).length > 0) {
//       if (e.title)            titleRef.current?.focus();
//       else if (e.description) descRef.current?.focus();
//       else if (e.price)       priceRef.current?.focus();
//       else if (e.category)    categoryRef.current?.focus();
//       return;
//     }
//     onSubmit({ ...fields, price: Number(fields.price) });
//   };
 
//   const inputCls = (key) =>
//     `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
//       errors[key] && touched[key]
//         ? "border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-200"
//         : "border-gray-200 bg-gray-50 focus:border-[#0e9888] focus:ring-2 focus:ring-[#0e9888]/15 focus:bg-white"
//     }`;
 
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
//       className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#f0faf8] to-white">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 bg-[#0e9888] rounded-xl flex items-center justify-center">
//             {isEdit
//               ? <Edit3 size={17} className="text-white" />
//               : <PlusCircle size={17} className="text-white" />
//             }
//           </div>
//           <div>
//             <h2 className="font-black text-gray-900 text-base">
//               {isEdit ? "編輯課程資訊" : "建立新課程"}
//             </h2>
//             <p className="text-xs text-gray-400">
//               {isEdit ? `正在編輯：${initial.title}` : "填寫課程基本資料"}
//             </p>
//           </div>
//         </div>
//         <motion.button
//           onClick={onCancel}
//           whileHover={{ scale: 1.1, rotate: 90 }}
//           whileTap={{ scale: 0.9 }}
//           transition={{ duration: 0.18 }}
//           className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
//         >
//           <X size={18} />
//         </motion.button>
//       </div>
 
//       {/* Fields */}
//       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
//         {/* 課程名稱 */}
//         <div className="md:col-span-2">
//           <label className="text-xs font-bold text-gray-600 mb-1.5 block">
//             課程名稱 <span className="text-rose-400">*</span>
//           </label>
//           <input
//             ref={titleRef}
//             value={fields.title}
//             onChange={e => set("title", e.target.value)}
//             onBlur={() => blur("title")}
//             placeholder="例：從零開始學習 React 前端開發"
//             className={inputCls("title")}
//           />
//           {errors.title && touched.title && (
//             <p className="text-xs text-rose-500 mt-1">{errors.title}</p>
//           )}
//         </div>
 
//         {/* 課程介紹 */}
//         <div className="md:col-span-2">
//           <label className="text-xs font-bold text-gray-600 mb-1.5 block">
//             課程介紹 <span className="text-rose-400">*</span>
//           </label>
//           <textarea
//             ref={descRef}
//             value={fields.description}
//             onChange={e => set("description", e.target.value)}
//             onBlur={() => blur("description")}
//             placeholder="詳細描述課程內容、學習目標與適合對象..."
//             rows={4}
//             className={`${inputCls("description")} resize-none`}
//           />
//           {errors.description && touched.description && (
//             <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
//           )}
//         </div>
 
//         {/* 課程金額 */}
//         <div>
//           <label className="text-xs font-bold text-gray-600 mb-1.5 block">
//             課程金額（NT$）<span className="text-rose-400">*</span>
//             <span className="text-gray-400 font-normal ml-1">上限 200,000</span>
//           </label>
//           <div className="relative">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">$</span>
//             <input
//               ref={priceRef}
//               type="number"
//               min={0}
//               max={200000}
//               value={fields.price}
//               onChange={e => set("price", e.target.value)}
//               onBlur={() => blur("price")}
//               placeholder="0"
//               className={`${inputCls("price")} pl-8`}
//             />
//           </div>
//           {errors.price && touched.price && (
//             <p className="text-xs text-rose-500 mt-1">{errors.price}</p>
//           )}
//         </div>
 
//         {/* 課程類別 */}
//         <div>
//           <label className="text-xs font-bold text-gray-600 mb-1.5 block">
//             課程類別 <span className="text-rose-400">*</span>
//           </label>
//           <div className="relative">
//             <select
//               ref={categoryRef}
//               value={fields.category}
//               onChange={e => set("category", e.target.value)}
//               onBlur={() => blur("category")}
//               className={`${inputCls("category")} appearance-none pr-10 cursor-pointer`}
//             >
//               <option value="">請選擇類別</option>
//               {CATEGORY_OPTIONS.map(c => (
//                 <option key={c} value={c}>{c}</option>
//               ))}
//             </select>
//             <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//           </div>
//           {errors.category && touched.category && (
//             <p className="text-xs text-rose-500 mt-1">{errors.category}</p>
//           )}
//         </div>
 
//         {/* 課程狀態 */}
//         <div className="md:col-span-2">
//           <label className="text-xs font-bold text-gray-600 mb-2 block">課程狀態</label>
//           {!isEdit ? (
//             // ── 建立模式：只顯示「未上架」說明，不可選取 ──
//             <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 w-fit">
//               <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
//               <span className="text-sm font-semibold text-gray-500">未上架（預設）</span>
//               <span className="text-xs text-gray-400 ml-1">— 建立後可在編輯中切換上架</span>
//             </div>
//           ) : (
//             // ── 編輯模式：顯示兩個 radio 選項 ──
//             <div className="flex flex-wrap gap-3">
//               {["未上架", "上架"].map((s) => (
//                 <label
//                   key={s}
//                   className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold select-none ${
//                     fields.status === s
//                       ? s === "上架"
//                         ? "border-emerald-400 bg-emerald-50 text-emerald-700"
//                         : "border-gray-300 bg-gray-50 text-gray-600"
//                       : "border-gray-200 text-gray-400 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="status"
//                     value={s}
//                     checked={fields.status === s}
//                     onChange={() => set("status", s)}
//                     className="sr-only"
//                   />
//                   <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
//                     fields.status === s
//                       ? s === "上架" ? "bg-emerald-500" : "bg-gray-400"
//                       : "bg-gray-200"
//                   }`} />
//                   {s === "上架" ? "上架" : "未上架"}
//                 </label>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
 
//       {/* Footer */}
//       <div className="px-6 pb-6 flex items-center justify-end gap-3 border-t border-gray-50 pt-5">
//         <motion.button
//           onClick={onCancel}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           disabled={loading}
//           className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
//         >
//           取消
//         </motion.button>
//         <motion.button
//           onClick={handleSubmit}
//           whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(14,152,136,0.28)" }}
//           whileTap={{ scale: 0.98 }}
//           disabled={loading}
//           className="flex items-center gap-2 px-6 py-2.5 bg-[#0e9888] text-white rounded-xl font-bold text-sm shadow-sm disabled:opacity-60"
//         >
//           {loading
//             ? <><Loader2 size={15} className="animate-spin" /> 處理中...</>
//             : <><Save size={15} /> {isEdit ? "儲存變更" : "建立課程"}</>
//           }
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// 確認刪除課程Modal
// const DeleteModal = ({ course, onConfirm, onCancel, loading, error }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 z-50 flex items-center justify-center px-4"
//     style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
//   >
//     <motion.div
//       initial={{ scale: 0.88, opacity: 0, y: 20 }}
//       animate={{ scale: 1, opacity: 1, y: 0 }}
//       exit={{ scale: 0.95, opacity: 0 }}
//       transition={{ type: "spring", stiffness: 400, damping: 28 }}
//       className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full"
//     >
//       <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
//         <AlertTriangle size={28} className="text-rose-500" />
//       </div>
//       <h3 className="text-lg font-black text-gray-900 text-center mb-2">確認刪除課程？</h3>
//       <p className="text-sm text-gray-500 text-center mb-1">
//         即將刪除：<span className="font-semibold text-gray-700">「{course?.title}」</span>
//       </p>
//       <p className="text-xs text-rose-400 text-center mb-7">此操作無法復原，課程資料將永久消失。</p>
//       {error && (
//         <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl px-4 py-3 mb-5 text-xs">
//           <AlertTriangle size={14} className="flex-shrink-0" />
//           {error}
//         </div>
//       )}
//       <div className="flex gap-3">
//         <motion.button
//           onClick={onCancel}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           disabled={loading}
//           className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors"
//         >
//           取消
//         </motion.button>
//         <motion.button
//           onClick={onConfirm}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           disabled={loading}
//           className="flex-1 py-3 bg-rose-500 text-white rounded-2xl font-semibold text-sm hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
//         >
//           {loading
//             ? <><Loader2 size={16} className="animate-spin" /> 刪除中...</>
//             : <><Trash2 size={16} /> 確認刪除</>
//           }
//         </motion.button>
//       </div>
//     </motion.div>
//   </motion.div>
// );
 







// Course Card: Student
// const StudentCourseCard = ({ course, index }) => (
//   <motion.div
//     variants={fadeUp}
//     custom={index}
//     whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(14,152,136,0.13)" }}
//     transition={{ type: "spring", stiffness: 320, damping: 22 }}
//     className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
//   >
//     <div className="relative overflow-hidden aspect-video">
//       <img src={course.image} alt={course.title}
//         className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
//       {course.status === "in_progress" && (
//         <div className="absolute top-3 left-3 bg-[#fec601] text-gray-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
//           🔥 限時 8 折
//         </div>
//       )}
//       {course.status === "completed" && (
//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//           <div className="bg-white/95 rounded-full p-3">
//             <CheckCircle size={28} className="text-emerald-500" />
//           </div>
//         </div>
//       )}
//     </div>
//     <div className="p-4 flex flex-col flex-1">
//       <div className="flex items-start justify-between gap-2 mb-2">
//         <h3 className="font-bold text-gray-800 text-sm line-clamp-2 flex-1">{course.title}</h3>
//         <StatusBadge status={course.status} />
//       </div>
//       <div className="flex items-center gap-2 mb-2">
//         <img src={course.avatar} alt={course.instructor} className="w-5 h-5 rounded-full" />
//         <span className="text-xs text-gray-400">{course.instructor}</span>
//       </div>
//       <div className="flex items-center justify-between text-xs">
//         <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{course.tags[0]}</span>
//         <span className="flex items-center text-[#fec601] font-bold">
//           <Star size={11} fill="currentColor" />
//           <span className="ml-1">{course.rating}</span>
//           <span className="text-gray-300 font-normal ml-1">({course.reviews})</span>
//         </span>
//       </div>
//       {course.status !== "not_started" && (
//         <>
//           <ProgressBar value={course.progress} />
//           <div className="flex justify-between items-center mt-1.5">
//             <span className="text-xs text-gray-400">學習進度</span>
//             <span className="text-xs font-bold text-[#0e9888]">{course.progress}%</span>
//           </div>
//         </>
//       )}
//       <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
//         <div>
//           <span className="text-[#0e9888] font-bold text-sm">NT$ {course.price.toLocaleString()}</span>
//           <span className="text-xs text-gray-300 line-through ml-2">NT$ {course.originalPrice.toLocaleString()}</span>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="flex items-center gap-1 px-3 py-1.5 bg-[#0e9888] text-white text-xs rounded-xl font-semibold"
//         >
//           <PlayCircle size={14} /> 繼續學習
//         </motion.button>
//       </div>
//     </div>
//   </motion.div>
// );
 
// Course Card: Bookmarked
// const BookmarkCard = ({ course, index }) => (
//   <motion.div
//     variants={fadeUp}
//     custom={index}
//     whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.09)" }}
//     transition={{ type: "spring", stiffness: 320, damping: 22 }}
//     className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
//   >
//     <div className="relative overflow-hidden aspect-video">
//       <img src={course.image} alt={course.title}
//         className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
//       <motion.button
//         whileHover={{ scale: 1.15 }}
//         whileTap={{ scale: 0.85 }}
//         className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
//       >
//         <Heart size={15} className="text-rose-500 fill-rose-500" />
//       </motion.button>
//     </div>
//     <div className="p-4 flex flex-col flex-1">
//       <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2">{course.title}</h3>
//       <div className="flex items-center gap-2 mb-3">
//         <img src={course.avatar} alt={course.instructor} className="w-5 h-5 rounded-full" />
//         <span className="text-xs text-gray-400">{course.instructor}</span>
//       </div>
//       <div className="flex items-center justify-between text-xs mb-3">
//         <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{course.tags[0]}</span>
//         <span className="flex items-center text-[#fec601] font-bold">
//           <Star size={11} fill="currentColor" />
//           <span className="ml-1">{course.rating}</span>
//           <span className="text-gray-300 font-normal ml-1">({course.reviews})</span>
//         </span>
//       </div>
//       <div className="text-xs text-gray-400 mb-3">已有 {course.students.toLocaleString()} 同學加入</div>
//       <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
//         <div>
//           <span className="text-[#0e9888] font-bold">NT$ {course.price.toLocaleString()}</span>
//           <span className="text-xs text-gray-300 line-through ml-2">NT$ {course.originalPrice.toLocaleString()}</span>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.1, backgroundColor: "#0b7a6d" }}
//           whileTap={{ scale: 0.9 }}
//           className="p-2 bg-[#0e9888] text-white rounded-xl"
//         >
//           <ShoppingCart size={16} />
//         </motion.button>
//       </div>
//     </div>
//   </motion.div>
// );
 
// Course Card: Instructor
// const InstructorCourseCard = ({ course, index }) => (
//   <motion.div
//     variants={fadeUp}
//     custom={index}
//     whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(14,152,136,0.12)" }}
//     transition={{ type: "spring", stiffness: 320, damping: 22 }}
//     className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
//   >
//     <div className="relative overflow-hidden aspect-video">
//       <img src={course.image} alt={course.title}
//         className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
//       <div className="absolute top-3 left-3">
//         <StatusBadge status={course.status} />
//       </div>
//     </div>
//     <div className="p-4 flex flex-col flex-1">
//       <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-3">{course.title}</h3>
//       <div className="grid grid-cols-3 gap-2 mb-3">
//         <div className="text-center">
//           <div className="text-sm font-bold text-gray-800">{course.students.toLocaleString()}</div>
//           <div className="text-[10px] text-gray-400">學生</div>
//         </div>
//         <div className="text-center border-x border-gray-100">
//           <div className="text-sm font-bold text-[#fec601]">
//             {course.rating > 0 ? course.rating : "—"}
//           </div>
//           <div className="text-[10px] text-gray-400">評分</div>
//         </div>
//         <div className="text-center">
//           <div className="text-sm font-bold text-[#0e9888]">
//             {course.revenue > 0 ? `NT$${(course.revenue / 1000).toFixed(0)}K` : "—"}
//           </div>
//           <div className="text-[10px] text-gray-400">收益</div>
//         </div>
//       </div>
//       <div className="mt-auto flex items-center gap-2 border-t border-gray-50 pt-3">
//         <motion.button
//           whileHover={{ scale: 1.04 }}
//           whileTap={{ scale: 0.96 }}
//           className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 text-xs rounded-xl font-medium hover:border-[#0e9888] hover:text-[#0e9888] transition-colors"
//         >
//           <Edit3 size={13} /> 編輯
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.04 }}
//           whileTap={{ scale: 0.96 }}
//           className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 text-xs rounded-xl font-medium hover:border-blue-400 hover:text-blue-500 transition-colors"
//         >
//           <Eye size={13} /> 預覽
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.04 }}
//           whileTap={{ scale: 0.96 }}
//           className="p-2 border border-gray-200 text-gray-400 rounded-xl hover:border-rose-400 hover:text-rose-400 transition-colors"
//         >
//           <Trash2 size={14} />
//         </motion.button>
//       </div>
//     </div>
//   </motion.div>
// );
 

// 講師課程元件
 
// const InstructorCourseCard = ({ course, index, onEdit, onDelete }) => {
//   const img = CATEGORY_IMAGES[course.category] || CATEGORY_IMAGES["其他"];
//   const studentCount = Array.isArray(course.students) ? course.students.length : (course.students || 0);
 
//   return (
//     <motion.div
//       variants={fadeUp}
//       custom={index}
//       whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(14,152,136,0.12)" }}
//       transition={{ type: "spring", stiffness: 320, damping: 22 }}
//       className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
//     >
//       <div className="relative overflow-hidden aspect-video">
//         <img
//           src={img}
//           alt={course.title}
//           className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//         />
//         <div className="absolute top-3 left-3">
//           <StatusBadge status={course.status} />
//         </div>
//         {course.category && (
//           <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
//             {course.category}
//           </div>
//         )}
//       </div>
 
//       <div className="p-4 flex flex-col flex-1">
//         <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
//           {course.title}
//         </h3>
//         <p className="text-xs text-gray-400 line-clamp-2 mb-3 min-h-[2rem]">
//           {course.description}
//         </p>
 
//         {/* Stats mini grid */}
//         <div className="grid grid-cols-3 gap-2 mb-3 bg-gray-50 rounded-xl p-2.5">
//           <div className="text-center">
//             <div className="text-sm font-bold text-gray-800">{studentCount.toLocaleString()}</div>
//             <div className="text-[10px] text-gray-400">學生</div>
//           </div>
//           <div className="text-center border-x border-gray-200">
//             <div className="text-sm font-bold text-[#0e9888]">
//               NT${Number(course.price).toLocaleString()}
//             </div>
//             <div className="text-[10px] text-gray-400">售價</div>
//           </div>
//           <div className="text-center">
//             <div className="text-sm font-bold text-gray-500">
//               {course.chapters?.length || 0}
//             </div>
//             <div className="text-[10px] text-gray-400">章節</div>
//           </div>
//         </div>
 
//         {/* Actions */}
//         <div className="mt-auto flex items-center gap-2 border-t border-gray-50 pt-3">
//           <motion.button
//             onClick={() => onEdit(course)}
//             whileHover={{ scale: 1.04 }}
//             whileTap={{ scale: 0.96 }}
//             className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 text-xs rounded-xl font-medium hover:border-[#0e9888] hover:text-[#0e9888] transition-colors"
//           >
//             <Edit3 size={13} /> 編輯
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.04 }}
//             whileTap={{ scale: 0.96 }}
//             className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 text-xs rounded-xl font-medium hover:border-blue-400 hover:text-blue-500 transition-colors"
//           >
//             <Eye size={13} /> 預覽
//           </motion.button>
//           <motion.button
//             onClick={() => onDelete(course)}
//             whileHover={{ scale: 1.04 }}
//             whileTap={{ scale: 0.96 }}
//             className="p-2 border border-gray-200 text-gray-400 rounded-xl hover:border-rose-400 hover:text-rose-400 transition-colors"
//           >
//             <Trash2 size={14} />
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };
 
// 我的課程Tab
 
// const InstructorCoursesTab = ({ currentUser }) => {
//   const [courses, setCourses]             = useState([]);
//   const [loadingList, setLoadingList]     = useState(true);
//   const [fetchError, setFetchError]       = useState("");
//   const [editTarget, setEditTarget]       = useState(null);
//   const [editError, setEditError]         = useState("");
//   const [deleteTarget, setDeleteTarget]   = useState(null);
//   const [deleteError, setDeleteError]     = useState("");
//   const [formLoading, setFormLoading]     = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const formTopRef = useRef(null);
 
//   useEffect(() => {
//     const _id = currentUser?.user?._id;
//     if (!_id) return;
//     setLoadingList(true);
//     CourseService.getInstructorCourses(_id)
//       .then(res => { setCourses(res.data || []); setFetchError(""); })
//       .catch(() => setFetchError("無法載入課程，請稍後再試"))
//       .finally(() => setLoadingList(false));
//   }, []);
 
//   // 串接 PATCH /api/courses/:_id
//   const handleEditSubmit = async (fields) => {
//     setFormLoading(true);
//     setEditError("");
//     try {
//       const res = await CourseService.updateCourse(editTarget._id, fields);
//       const updated = res.data?.updatedCourse || { ...editTarget, ...fields };
//       setCourses(prev => prev.map(c => c._id === editTarget._id ? updated : c));
//       setEditTarget(null);
//     } catch (err) {
//       console.error("編輯課程失敗:", err);
//       setEditError(
//         err?.response?.data?.message || "儲存失敗，請確認資料格式後再試"
//       );
//     } finally {
//       setFormLoading(false);
//     }
//   };
 
//   // 串接 DELETE /api/courses/:_id
//   const handleDeleteConfirm = async () => {
//     setDeleteLoading(true);
//     setDeleteError("");
//     try {
//       await CourseService.deleteCourse(deleteTarget._id);
//       setCourses(prev => prev.filter(c => c._id !== deleteTarget._id));
//       setDeleteTarget(null);
//     } catch (err) {
//       console.error("刪除課程失敗:", err);
//       setDeleteError(
//         err?.response?.data?.message || "刪除失敗，請稍後再試"
//       );
//     } finally {
//       setDeleteLoading(false);
//     }
//   };
 
//   const handleEditClick = (course) => {
//     setEditTarget(course);
//     setEditError("");
//     setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
//   };
 
//   if (loadingList) return (
//     <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
//       <Loader2 size={22} className="animate-spin text-[#0e9888]" />
//       <span className="text-sm">載入課程中...</span>
//     </div>
//   );
 
//   if (fetchError) return (
//     <div className="flex flex-col items-center py-20 gap-3 text-rose-400">
//       <AlertTriangle size={28} />
//       <span className="text-sm">{fetchError}</span>
//     </div>
//   );
 
//   return (
//     <div>
//       {/* Delete confirm modal */}
//       <AnimatePresence>
//         {deleteTarget && (
//           <DeleteModal
//             course={deleteTarget}
//             onConfirm={handleDeleteConfirm}
//             onCancel={() => { setDeleteTarget(null); setDeleteError(""); }}
//             loading={deleteLoading}
//             error={deleteError}
//           />
//         )}
//       </AnimatePresence>
 
//       {/* Edit form */}
//       <div ref={formTopRef} />
//       <AnimatePresence>
//         {editTarget && (
//           <div className="mb-6">
//             {/* Edit API error banner */}
//             <AnimatePresence>
//               {editError && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl px-5 py-4 mb-4 text-sm"
//                 >
//                   <AlertTriangle size={17} className="flex-shrink-0" />
//                   {editError}
//                   <button onClick={() => setEditError("")} className="ml-auto text-rose-400 hover:text-rose-600">
//                     <X size={15} />
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//             <CourseForm
//               initial={editTarget}
//               onSubmit={handleEditSubmit}
//               onCancel={() => { setEditTarget(null); setEditError(""); }}
//               loading={formLoading}
//             />
//           </div>
//         )}
//       </AnimatePresence>
 
//       {courses.length === 0 ? (
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col items-center py-20 gap-4 text-gray-400"
//         >
//           <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
//             <FileText size={28} className="text-gray-300" />
//           </div>
//           <p className="text-sm font-semibold">尚未建立任何課程</p>
//           <p className="text-xs">前往「建立新課程」開始建立你的第一堂課</p>
//         </motion.div>
//       ) : (
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={stagger}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
//         >
//           {courses.map((c, i) => (
//             <InstructorCourseCard
//               key={c._id || c.id}
//               course={c}
//               index={i}
//               onEdit={handleEditClick}
//               onDelete={setDeleteTarget}
//             />
//           ))}
//         </motion.div>
//       )}
//     </div>
//   );
// };
 
 
// // 建立新課程Tab 
// const CreateCourseTab = ({ currentUser, onCreated }) => {
//   const [loading, setLoading]           = useState(false);
//   const [success, setSuccess]           = useState(false);
//   const [createdCourse, setCreatedCourse] = useState(null);
//   const [error, setError]               = useState("");
 
//   const handleSubmit = async (fields) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await CourseService.postNewCourse(
//         fields.title,
//         fields.description,
//         fields.price,
//         fields.category,
//         fields.status,
//         fields.chapters
//       );
//       const saved = res.data?.savedCourse;
//       setCreatedCourse(saved);
//       setSuccess(true);
//       if (onCreated) onCreated(saved);
//     } catch (err) {
//       setError(err?.response?.data?.message || "建立課程失敗，請稍後再試");
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   // Success: show preview card
//   if (success && createdCourse) {
//     const img = CATEGORY_IMAGES[createdCourse.category] || CATEGORY_IMAGES["其他"];
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.97 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="max-w-xl mx-auto"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 mb-6"
//         >
//           <CheckCircle size={20} className="flex-shrink-0" />
//           <div>
//             <p className="font-bold text-sm">課程建立成功！</p>
//             <p className="text-xs text-emerald-600">
//               你可以前往「我的課程」查看或繼續建立新課程
//             </p>
//           </div>
//         </motion.div>
 
//         {/* Preview card */}
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.15 }}
//           className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-6"
//         >
//           <div className="aspect-video overflow-hidden relative">
//             <img src={img} alt={createdCourse.title} className="w-full h-full object-cover" />
//             <div className="absolute top-3 left-3"><StatusBadge status={createdCourse.status} /></div>
//             {createdCourse.category && (
//               <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
//                 {createdCourse.category}
//               </div>
//             )}
//           </div>
//           <div className="p-5">
//             <h3 className="font-black text-gray-900 mb-1">{createdCourse.title}</h3>
//             <p className="text-sm text-gray-400 line-clamp-2 mb-4">{createdCourse.description}</p>
//             <div className="flex items-center justify-between">
//               <span className="text-[#0e9888] font-bold text-lg">
//                 NT$ {Number(createdCourse.price).toLocaleString()}
//               </span>
//               <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
//                 {createdCourse.category}
//               </span>
//             </div>
//           </div>
//         </motion.div>
 
//         <motion.button
//           onClick={() => { setSuccess(false); setCreatedCourse(null); setError(""); }}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className="w-full py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors"
//         >
//           繼續建立新課程
//         </motion.button>
//       </motion.div>
//     );
//   }
 
//   return (
//     <div className="max-w-2xl mx-auto">
//       <AnimatePresence>
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl px-5 py-4 mb-5 text-sm"
//           >
//             <AlertTriangle size={18} className="flex-shrink-0" />
//             {error}
//             <button onClick={() => setError("")} className="ml-auto text-rose-400 hover:text-rose-600">
//               <X size={16} />
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//       <CourseForm
//         onSubmit={handleSubmit}
//         onCancel={() => setError("")}
//         loading={loading}
//       />
//     </div>
//   );
// };



// // 頁簽Tab btn
// const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
//   <motion.button
//     onClick={onClick}
//     whileHover={{ y: -1 }}
//     whileTap={{ scale: 0.97 }}
//     className={`flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
//       active
//         ? "bg-[#0e9888] text-white shadow-md shadow-[#0e9888]/30"
//         : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
//     }`}
//   >
//     <Icon size={14} className="flex-shrink-0" />
//     <span>{label}</span>
//     {count !== undefined && (
//       <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold ${
//         active ? "bg-white/25 text-white" : "bg-gray-200 text-gray-500"
//       }`}>{count}</span>
//     )}
//   </motion.button>
// );



// // Stat Card
// // const StatCard = ({ icon: Icon, label, value, color, delay }) => (
// //   <motion.div
// //     variants={fadeUp}
// //     custom={delay}
// //     className="text-center"
// //   >
// //     <motion.div
// //       whileHover={{ scale: 1.1, rotate: 5 }}
// //       transition={{ type: "spring", stiffness: 400 }}
// //       className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mx-auto mb-1`}
// //     >
// //       <Icon size={18} />
// //     </motion.div>
// //     <div className="text-2xl font-black text-gray-900">{value}</div>
// //     <div className="text-xs text-gray-400 mt-0.5">{label}</div>
// //   </motion.div>
// // );

// // ─── Stat Card ────────────────────────────────────────────────────────────────
 
// const StatCard = ({ icon: Icon, label, value, color, delay }) => (
//   <motion.div variants={fadeUp} custom={delay} className="text-center">
//     <motion.div
//       whileHover={{ scale: 1.1, rotate: 5 }}
//       transition={{ type: "spring", stiffness: 400 }}
//       className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mx-auto mb-1`}
//     >
//       <Icon size={18} />
//     </motion.div>
//     <div className="text-2xl font-black text-gray-900">{value}</div>
//     <div className="text-xs text-gray-400 mt-0.5">{label}</div>
//   </motion.div>
// );


// ─── Profile Header ───────────────────────────────────────────────────────────
// const ProfileHeader = ({ user, isInstructor, activeTab, onTabChange }) => {
//   const studentTabs = [
//     { key: "courses",   icon: BookOpen, label: "我的課程",  count: 4 },
//     { key: "bookmarks", icon: Bookmark, label: "我的收藏",  count: 2 },
//     { key: "portfolio", icon: Award,    label: "作品成果",  count: 5 }
//   ];
//   const instructorTabs = [
//     { key: "courses",   icon: BookOpen,    label: "我的課程",  count: 3 },
//     { key: "publish",   icon: Upload,      label: "發佈課程" },
//     { key: "analytics", icon: BarChart2,   label: "數據分析" }
//   ];
//   const tabs = isInstructor ? instructorTabs : studentTabs;
 
//   const studentStats = [
//     { icon: BookOpen,    label: "我的課程", value: 4,   color: "bg-blue-100 text-blue-600",    delay: 0 },
//     { icon: Heart,       label: "我的收藏", value: 2,   color: "bg-rose-100 text-rose-500",    delay: 1 },
//     { icon: Award,       label: "作品成果", value: 5,   color: "bg-amber-100 text-amber-500",  delay: 2 }
//   ];
//   const instructorStats = [
//     { icon: BookOpen,    label: "發佈課程", value: 2,      color: "bg-blue-100 text-blue-600",    delay: 0 },
//     { icon: Users,       label: "學生總數", value: "2.2K", color: "bg-purple-100 text-purple-600",delay: 1 },
//     { icon: TrendingUp,  label: "總收益",   value: "67K",  color: "bg-emerald-100 text-emerald-600", delay: 2 }
//   ];
//   const stats = isInstructor ? instructorStats : studentStats;
 
//   return (
//     <div className="bg-white border-b border-gray-100">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-0">
 
//         {/* ── Mobile: 全置中縱向堆疊 / Desktop: 橫向並排 ── */}
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={stagger}
//           className="flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6"
//         >
//           {/* Avatar */}
//           <motion.div variants={fadeUp} className="relative flex-shrink-0">
//             <motion.div
//               whileHover={{ scale: 1.05, rotate: 2 }}
//               transition={{ type: "spring", stiffness: 350, damping: 20 }}
//               className="w-20 h-20 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-[#0e9888]/15"
//             >
//               <img
//                 src={`https://randomuser.me/api/portraits/${isInstructor ? "women" : "men"}/44.jpg`}
//                 alt={user?.username}
//                 className="w-full h-full object-cover"
//               />
//             </motion.div>
//             {isInstructor && (
//               <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#fec601] rounded-full flex items-center justify-center shadow">
//                 <Award size={12} className="text-white" />
//               </div>
//             )}
//           </motion.div>
 
//           {/* Name + role — 手機置中，桌面靠左 */}
//           <motion.div variants={fadeUp} className="flex-1 min-w-0 text-center sm:text-left">
//             <h1 className="text-2xl font-black text-gray-900 tracking-tight">
//               {user?.username || "Jessica"}
//             </h1>
//             <span className={`inline-block mt-1 text-xs font-semibold px-3 py-1 rounded-full ${
//               isInstructor
//                 ? "bg-amber-100 text-amber-700"
//                 : "bg-[#e6f5f2] text-[#0e9888]"
//             }`}>
//               {isInstructor ? "✨ 講師" : "🎓 學員"}
//             </span>
//             <p className="text-xs text-gray-400 mt-1 truncate">
//               {user?.email || "jessica@example.com"}
//             </p>
//           </motion.div>
 
//           {/* Stats — 手機置中橫排，桌面推到右側 */}
//           <motion.div
//             variants={stagger}
//             className="flex items-center justify-center gap-6 sm:gap-10 sm:ml-auto w-full sm:w-auto"
//           >
//             {stats.map((s) => (
//               <StatCard key={s.label} {...s} />
//             ))}
//           </motion.div>
//         </motion.div>
 
//         {/* Tabs — 手機可橫向捲動，桌面正常顯示 */}
//         <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
//           <div className="flex items-center gap-1 sm:gap-2 pb-0 min-w-max sm:min-w-0 justify-center sm:justify-start">
//             {tabs.map((tab) => (
//               <TabButton
//                 key={tab.key}
//                 active={activeTab === tab.key}
//                 onClick={() => onTabChange(tab.key)}
//                 icon={tab.icon}
//                 label={tab.label}
//                 count={tab.count}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// ─── Profile Header ───────────────────────────────────────────────────────────
 
// const ProfileHeader = ({ user, isInstructor, activeTab, onTabChange, coursesCount }) => {
//   const studentTabs = [
//     { key: "courses",   icon: BookOpen,   label: "我的課程", count: STUDENT_COURSES.length },
//     { key: "bookmarks", icon: Bookmark,   label: "我的收藏", count: BOOKMARKED_COURSES.length },
//     { key: "portfolio", icon: Award,      label: "作品成果", count: 5 },
//   ];
//   const instructorTabs = [
//     { key: "courses",   icon: BookOpen,   label: "我的課程",  count: coursesCount },
//     { key: "create",    icon: PlusCircle, label: "建立新課程" },
//     { key: "analytics", icon: BarChart2,  label: "數據分析" },
//   ];
//   const tabs = isInstructor ? instructorTabs : studentTabs;
 
//   const studentStats = [
//     { icon: BookOpen, label: "我的課程", value: STUDENT_COURSES.length,    color: "bg-blue-100 text-blue-600",    delay: 0 },
//     { icon: Heart,    label: "我的收藏", value: BOOKMARKED_COURSES.length,  color: "bg-rose-100 text-rose-500",    delay: 1 },
//     { icon: Award,    label: "作品成果", value: 5,                          color: "bg-amber-100 text-amber-500",  delay: 2 },
//   ];
//   const instructorStats = [
//     { icon: BookOpen,   label: "我的課程", value: coursesCount, color: "bg-blue-100 text-blue-600",         delay: 0 },
//     { icon: Users,      label: "學生總數", value: "—",          color: "bg-purple-100 text-purple-600",     delay: 1 },
//     { icon: TrendingUp, label: "已上架",   value: "—",          color: "bg-emerald-100 text-emerald-600",   delay: 2 },
//   ];
//   const stats = isInstructor ? instructorStats : studentStats;
 
//   return (
//     <div className="bg-white border-b border-gray-100">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-0">
//         <motion.div
//           initial="hidden" animate="visible" variants={stagger}
//           className="flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6"
//         >
//           <motion.div variants={fadeUp} className="relative flex-shrink-0">
//             <motion.div
//               whileHover={{ scale: 1.05, rotate: 2 }}
//               transition={{ type: "spring", stiffness: 350, damping: 20 }}
//               className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-[#0e9888]/15"
//             >
//               <img
//                 src={`https://randomuser.me/api/portraits/${isInstructor ? "women" : "men"}/44.jpg`}
//                 alt={user?.username}
//                 className="w-full h-full object-cover"
//               />
//             </motion.div>
//             {isInstructor && (
//               <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#fec601] rounded-full flex items-center justify-center shadow">
//                 <Award size={12} className="text-white" />
//               </div>
//             )}
//           </motion.div>
 
//           <motion.div variants={fadeUp} className="flex-1 min-w-0 text-center sm:text-left">
//             <h1 className="text-2xl font-black text-gray-900 tracking-tight">
//               {user?.username || "使用者"}
//             </h1>
//             <span className={`inline-flex items-center gap-1.5 mt-1 text-xs font-semibold px-3 py-1 rounded-full ${
//               isInstructor ? "bg-amber-100 text-amber-700" : "bg-[#e6f5f2] text-[#0e9888]"
//             }`}>
//               {isInstructor
//                 ? <Mic2 size={12} strokeWidth={2.5} />
//                 : <GraduationCap size={12} strokeWidth={2.5} />
//               }
//               {isInstructor ? "講師" : "學員"}
//             </span>
//             <p className="text-xs text-gray-400 mt-1 truncate">{user?.email}</p>
//           </motion.div>
 
//           <motion.div
//             variants={stagger}
//             className="flex items-center justify-center gap-6 sm:gap-10 sm:ml-auto w-full sm:w-auto"
//           >
//             {stats.map(s => <StatCard key={s.label} {...s} />)}
//           </motion.div>
//         </motion.div>
 
//         <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
//           <div className="flex items-center gap-1 sm:gap-2 pb-4 min-w-max sm:min-w-0 justify-center sm:justify-start">
//             {tabs.map(tab => (
//               <TabButton
//                 key={tab.key}
//                 active={activeTab === tab.key}
//                 onClick={() => onTabChange(tab.key)}
//                 icon={tab.icon}
//                 label={tab.label}
//                 count={tab.count}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// // ─── Student Course Card ──────────────────────────────────────────────────────
 
// const StudentCourseCard = ({ course, index }) => (
//   <motion.div
//     variants={fadeUp}
//     custom={index}
//     whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(14,152,136,0.13)" }}
//     transition={{ type: "spring", stiffness: 320, damping: 22 }}
//     className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
//   >
//     <div className="relative overflow-hidden aspect-video">
//       <img src={course.image} alt={course.title}
//         className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
//       {course.status === "in_progress" && (
//         <div className="absolute top-3 left-3 bg-[#fec601] text-gray-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
//           🔥 限時 8 折
//         </div>
//       )}
//       {course.status === "completed" && (
//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//           <div className="bg-white/95 rounded-full p-3">
//             <CheckCircle size={28} className="text-emerald-500" />
//           </div>
//         </div>
//       )}
//     </div>
//     <div className="p-4 flex flex-col flex-1">
//       <div className="flex items-start justify-between gap-2 mb-2">
//         <h3 className="font-bold text-gray-800 text-sm line-clamp-2 flex-1">{course.title}</h3>
//         <StatusBadge status={course.status} />
//       </div>
//       <div className="flex items-center gap-2 mb-2">
//         <img src={course.avatar} alt={course.instructor} className="w-5 h-5 rounded-full" />
//         <span className="text-xs text-gray-400">{course.instructor}</span>
//       </div>
//       <div className="flex items-center justify-between text-xs">
//         <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{course.tags[0]}</span>
//         <span className="flex items-center text-[#fec601] font-bold">
//           <Star size={11} fill="currentColor" />
//           <span className="ml-1">{course.rating}</span>
//           <span className="text-gray-300 font-normal ml-1">({course.reviews})</span>
//         </span>
//       </div>
//       {course.status !== "not_started" && (
//         <>
//           <ProgressBar value={course.progress} />
//           <div className="flex justify-between items-center mt-1.5">
//             <span className="text-xs text-gray-400">學習進度</span>
//             <span className="text-xs font-bold text-[#0e9888]">{course.progress}%</span>
//           </div>
//         </>
//       )}
//       <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
//         <div>
//           <span className="text-[#0e9888] font-bold text-sm">NT$ {course.price.toLocaleString()}</span>
//           <span className="text-xs text-gray-300 line-through ml-2">NT$ {course.originalPrice.toLocaleString()}</span>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="flex items-center gap-1 px-3 py-1.5 bg-[#0e9888] text-white text-xs rounded-xl font-semibold"
//         >
//           <PlayCircle size={14} /> 繼續學習
//         </motion.button>
//       </div>
//     </div>
//   </motion.div>
// );
 
// // ─── Bookmark Card ────────────────────────────────────────────────────────────
 
// const BookmarkCard = ({ course, index }) => (
//   <motion.div
//     variants={fadeUp}
//     custom={index}
//     whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.09)" }}
//     transition={{ type: "spring", stiffness: 320, damping: 22 }}
//     className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
//   >
//     <div className="relative overflow-hidden aspect-video">
//       <img src={course.image} alt={course.title}
//         className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
//       <motion.button
//         whileHover={{ scale: 1.15 }}
//         whileTap={{ scale: 0.85 }}
//         className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
//       >
//         <Heart size={15} className="text-rose-500 fill-rose-500" />
//       </motion.button>
//     </div>
//     <div className="p-4 flex flex-col flex-1">
//       <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2">{course.title}</h3>
//       <div className="flex items-center gap-2 mb-3">
//         <img src={course.avatar} alt={course.instructor} className="w-5 h-5 rounded-full" />
//         <span className="text-xs text-gray-400">{course.instructor}</span>
//       </div>
//       <div className="flex items-center justify-between text-xs mb-3">
//         <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{course.tags[0]}</span>
//         <span className="flex items-center text-[#fec601] font-bold">
//           <Star size={11} fill="currentColor" />
//           <span className="ml-1">{course.rating}</span>
//           <span className="text-gray-300 font-normal ml-1">({course.reviews})</span>
//         </span>
//       </div>
//       <div className="text-xs text-gray-400 mb-3">已有 {course.students.toLocaleString()} 同學加入</div>
//       <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
//         <div>
//           <span className="text-[#0e9888] font-bold">NT$ {course.price.toLocaleString()}</span>
//           <span className="text-xs text-gray-300 line-through ml-2">NT$ {course.originalPrice.toLocaleString()}</span>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.1, backgroundColor: "#0b7a6d" }}
//           whileTap={{ scale: 0.9 }}
//           className="p-2 bg-[#0e9888] text-white rounded-xl"
//         >
//           <ShoppingCart size={16} />
//         </motion.button>
//       </div>
//     </div>
//   </motion.div>
// );


// // ─── Portfolio Tab ────────────────────────────────────────────────────────────
 
// const PortfolioTab = () => (
//   <motion.div initial="hidden" animate="visible" variants={stagger}
//     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
//   >
//     {[
//       { title: "Python 爬蟲專案：自動抓取股市數據", tag: "程式開發", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
//       { title: "響應式電商前端設計", tag: "網頁設計", image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80" },
//       { title: "JavaScript 互動遊戲：Tetris", tag: "程式開發", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80" },
//       { title: "個人品牌 Logo 設計提案", tag: "藝術設計", image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80" },
//       { title: "資料視覺化儀表板", tag: "數據分析", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
//     ].map((item, i) => (
//       <motion.div key={i} variants={fadeUp} custom={i}
//         whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.10)" }}
//         className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
//       >
//         <div className="aspect-video overflow-hidden">
//           <img src={item.image} alt={item.title}
//             className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
//         </div>
//         <div className="p-4">
//           <h3 className="font-bold text-sm text-gray-800 mb-2">{item.title}</h3>
//           <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{item.tag}</span>
//         </div>
//       </motion.div>
//     ))}
//     <motion.button variants={fadeUp} custom={5}
//       whileHover={{ y: -6, borderColor: "#0e9888" }}
//       className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 text-gray-400 hover:text-[#0e9888] transition-colors min-h-[180px]"
//     >
//       <PlusCircle size={32} />
//       <span className="text-sm font-semibold">新增作品</span>
//     </motion.button>
//   </motion.div>
// );

// // ─── Sub-tab filter for "我的課程" (student) ──────────────────────────────────
 
// const CourseSubTabs = ({ active, onChange, total }) => {
//   const tabs = [
//     { key: "all",         label: `所有課程 (${total})` },
//     { key: "in_progress", label: "已開課" },
//     { key: "not_started", label: "等待開課" },
//     { key: "completed",   label: "已完課" }
//   ];
//   return (
//     <div className="flex items-center gap-6 mb-6 border-b border-gray-100">
//       {tabs.map((t) => (
//         <button
//           key={t.key}
//           onClick={() => onChange(t.key)}
//           className={`pb-3 text-sm font-semibold transition-colors relative ${
//             active === t.key
//               ? "text-[#0e9888]"
//               : "text-gray-400 hover:text-gray-600"
//           }`}
//         >
//           {t.label}
//           {active === t.key && (
//             <motion.div
//               layoutId="course-sub-tab"
//               className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0e9888] rounded-full"
//             />
//           )}
//         </button>
//       ))}
//     </div>
//   );
// };
 
// // ─── Portfolio Placeholder ────────────────────────────────────────────────────
 
// // const PortfolioTab = () => (
// //   <motion.div
// //     initial="hidden"
// //     animate="visible"
// //     variants={stagger}
// //     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
// //   >
// //     {[
// //       { title: "Python 爬蟲專案：自動抓取股市數據", tag: "程式開發",
// //         image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
// //       { title: "響應式電商前端設計", tag: "網頁設計",
// //         image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80" },
// //       { title: "JavaScript 互動遊戲：Tetris 俄羅斯方塊", tag: "程式開發",
// //         image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80" },
// //       { title: "個人品牌 Logo 設計提案", tag: "藝術設計",
// //         image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80" },
// //       { title: "資料視覺化儀表板", tag: "數據分析",
// //         image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
// //     ].map((item, i) => (
// //       <motion.div
// //         key={i}
// //         variants={fadeUp}
// //         custom={i}
// //         whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.10)" }}
// //         className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
// //       >
// //         <div className="aspect-video overflow-hidden">
// //           <img src={item.image} alt={item.title}
// //             className="w-full h-full object-cover transition-transform duration-500 hover:scale-108" />
// //         </div>
// //         <div className="p-4">
// //           <h3 className="font-bold text-sm text-gray-800 mb-2">{item.title}</h3>
// //           <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{item.tag}</span>
// //         </div>
// //       </motion.div>
// //     ))}
// //     {/* Add new */}
// //     <motion.button
// //       variants={fadeUp}
// //       custom={5}
// //       whileHover={{ y: -6, borderColor: "#0e9888" }}
// //       className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 text-gray-400 hover:text-[#0e9888] transition-colors min-h-[180px]"
// //     >
// //       <PlusCircle size={32} />
// //       <span className="text-sm font-semibold">新增作品</span>
// //     </motion.button>
// //   </motion.div>
// // );

 
// // ─── Analytics Tab (Instructor) ───────────────────────────────────────────────
// // const AnalyticsTab = () => (
// //   <motion.div initial="hidden" animate="visible" variants={stagger}>
// //     <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
// //       {[
// //         { label: "總學生數", value: "2,210", icon: Users, color: "bg-purple-100 text-purple-600" },
// //         { label: "本月新增", value: "+148", icon: TrendingUp, color: "bg-emerald-100 text-emerald-600" },
// //         { label: "平均評分", value: "4.7", icon: Star, color: "bg-amber-100 text-amber-600" },
// //         { label: "總收益", value: "NT$67K", icon: BarChart2, color: "bg-blue-100 text-blue-600" }
// //       ].map((s, i) => (
// //         <motion.div
// //           key={i}
// //           variants={fadeUp}
// //           custom={i}
// //           whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.08)" }}
// //           className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4"
// //         >
// //           <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
// //             <s.icon size={20} />
// //           </div>
// //           <div>
// //             <div className="text-xl font-black text-gray-900">{s.value}</div>
// //             <div className="text-xs text-gray-400">{s.label}</div>
// //           </div>
// //         </motion.div>
// //       ))}
// //     </motion.div>
 
// //     {/* Revenue by course */}
// //     <motion.div variants={fadeUp} custom={1} className="bg-white rounded-2xl border border-gray-100 p-6">
// //       <h3 className="font-bold text-gray-800 mb-4">各課程收益分析</h3>
// //       {INSTRUCTOR_COURSES.filter(c => c.status === "published").map((c, i) => (
// //         <div key={c.id} className="mb-4 last:mb-0">
// //           <div className="flex justify-between text-xs text-gray-500 mb-1.5">
// //             <span className="font-medium text-gray-700 truncate mr-4">{c.title}</span>
// //             <span className="font-bold text-[#0e9888] flex-shrink-0">NT$ {c.revenue.toLocaleString()}</span>
// //           </div>
// //           <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
// //             <motion.div
// //               className="h-full bg-gradient-to-r from-[#0e9888] to-[#23a495] rounded-full"
// //               initial={{ width: 0 }}
// //               animate={{ width: `${(c.revenue / 50000) * 100}%` }}
// //               transition={{ duration: 1, ease: "easeOut", delay: i * 0.15 + 0.3 }}
// //             />
// //           </div>
// //         </div>
// //       ))}
// //     </motion.div>
// //   </motion.div>
// // );
 
// // ─── Analytics Tab ────────────────────────────────────────────────────────────
 
// const AnalyticsTab = ({ courses = [] }) => {
//   const totalStudents    = courses.reduce((acc, c) => acc + (Array.isArray(c.students) ? c.students.length : 0), 0);
//   const publishedCourses = courses.filter(c => c.status === "上架");
 
//   return (
//     <motion.div initial="hidden" animate="visible" variants={stagger}>
//       <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         {[
//           { label: "總學生數",    value: totalStudents.toLocaleString(), icon: Users,      color: "bg-purple-100 text-purple-600" },
//           { label: "已上架課程",  value: publishedCourses.length,         icon: TrendingUp, color: "bg-emerald-100 text-emerald-600" },
//           { label: "課程總數",    value: courses.length,                  icon: BookOpen,   color: "bg-blue-100 text-blue-600" },
//           { label: "平均評分",    value: "—",                             icon: Star,       color: "bg-amber-100 text-amber-600" },
//         ].map((s, i) => (
//           <motion.div key={i} variants={fadeUp} custom={i}
//             whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.08)" }}
//             className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4"
//           >
//             <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
//               <s.icon size={20} />
//             </div>
//             <div>
//               <div className="text-xl font-black text-gray-900">{s.value}</div>
//               <div className="text-xs text-gray-400">{s.label}</div>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>
//     </motion.div>
//   );
// };



// // ─── Publish Tab ──────────────────────────────────────────────────────────────
 
// const PublishTab = () => (
//   <motion.div
//     initial="hidden"
//     animate="visible"
//     variants={fadeUp}
//     className="flex flex-col items-center justify-center py-20 text-center"
//   >
//     <motion.div
//       whileHover={{ scale: 1.08, rotate: 3 }}
//       transition={{ type: "spring", stiffness: 350 }}
//       className="w-20 h-20 bg-[#e6f5f2] rounded-3xl flex items-center justify-center mb-6"
//     >
//       <Upload size={36} className="text-[#0e9888]" />
//     </motion.div>
//     <h2 className="text-2xl font-black text-gray-900 mb-3">發佈新課程</h2>
//     <p className="text-gray-400 text-sm max-w-xs mb-8">分享你的專業知識，幫助更多學生成長</p>
//     <motion.button
//       whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(14,152,136,0.35)" }}
//       whileTap={{ scale: 0.97 }}
//       className="flex items-center gap-2 px-8 py-3.5 bg-[#0e9888] text-white rounded-2xl font-bold text-sm shadow-md"
//     >
//       <PlusCircle size={18} /> 開始建立課程
//     </motion.button>
//   </motion.div>
// );



// // Main component 
// const ProfileComponent = ({ currentUser, setCurrentUser }) => {
//   const isInstructor = currentUser?.user?.role === "instructor";
 
//   const [activeTab, setActiveTab]       = useState("courses");
//   const [courseFilter, setCourseFilter] = useState("all");
 
//   // Instructor course list shared across tabs
//   const [instructorCourses, setInstructorCourses]       = useState([]);
//   const [instructorCoursesCount, setInstructorCoursesCount] = useState(0);
 
//   useEffect(() => {
//     if (!isInstructor || !currentUser?.user?._id) return;
//     CourseService.getInstructorCourses(currentUser.user._id)
//       .then(res => {
//         const data = res.data || [];
//         setInstructorCourses(data);
//         setInstructorCoursesCount(data.length);
//       })
//       .catch(console.error);
//   }, [isInstructor]);
 
//   const handleCourseCreated = (newCourse) => {
//     if (newCourse) {
//       setInstructorCourses(prev => [newCourse, ...prev]);
//       setInstructorCoursesCount(prev => prev + 1);
//     }
//   };
 
//   if (!currentUser) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//         className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
//       >
//         <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
//           <Users size={28} className="text-gray-400" />
//         </div>
//         <h2 className="text-lg font-bold text-gray-700 mb-2">尚未登入</h2>
//         <p className="text-sm text-gray-400">請先登入會員以查看個人檔案</p>
//       </motion.div>
//     );
//   }
 
//   const filteredStudentCourses = courseFilter === "all"
//     ? STUDENT_COURSES
//     : STUDENT_COURSES.filter(c => c.status === courseFilter);
 
//   const renderContent = () => {
//     if (!isInstructor) {
//       switch (activeTab) {
//         case "courses":
//           return (
//             <div>
//               <CourseSubTabs active={courseFilter} onChange={setCourseFilter} total={STUDENT_COURSES.length} />
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={courseFilter}
//                   initial="hidden" animate="visible"
//                   exit={{ opacity: 0, y: -10 }}
//                   variants={stagger}
//                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
//                 >
//                   {filteredStudentCourses.map((c, i) => (
//                     <StudentCourseCard key={c.id} course={c} index={i} />
//                   ))}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           );
//         case "bookmarks":
//           return (
//             <motion.div initial="hidden" animate="visible" variants={stagger}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
//             >
//               {BOOKMARKED_COURSES.map((c, i) => <BookmarkCard key={c.id} course={c} index={i} />)}
//             </motion.div>
//           );
//         case "portfolio":
//           return <PortfolioTab />;
//         default: return null;
//       }
//     } else {
//       switch (activeTab) {
//         case "courses":
//           return <InstructorCoursesTab currentUser={currentUser} />;
//         case "create":
//           return <CreateCourseTab currentUser={currentUser} onCreated={handleCourseCreated} />;
//         case "analytics":
//           return <AnalyticsTab courses={instructorCourses} />;
//         default: return null;
//       }
//     }
//   };
 
//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       <div
//         className="fixed inset-0 pointer-events-none z-0"
//         style={{
//           backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.025) 1px, transparent 1px),
//                             linear-gradient(to bottom, rgba(0,0,0,0.025) 1px, transparent 1px)`,
//           backgroundSize: "40px 40px",
//           maskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
//           WebkitMaskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
//         }}
//       />
 
//       <div className="relative z-10">
//         <ProfileHeader
//           user={currentUser?.user}
//           isInstructor={isInstructor}
//           activeTab={activeTab}
//           onTabChange={(tab) => { setActiveTab(tab); setCourseFilter("all"); }}
//           coursesCount={instructorCoursesCount}
//         />
 
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
//             >
//               {renderContent()}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ProfileComponent;