// 學生 Dashboard：StudentCourseCard、BookmarkCard、PortfolioTab
// Props: activeTab, courseFilter, onCourseFilterChange
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Heart, CheckCircle, PlayCircle,
  ShoppingCart, PlusCircle,
} from "lucide-react";
import { fadeUp, stagger, STUDENT_COURSES, BOOKMARKED_COURSES } from "./profile.constants";
import { StatusBadge, ProgressBar, CourseSubTabs } from "./profile-shared";


const StudentCourseCard = ({ course, index }) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(14,152,136,0.13)" }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
  >
    <div className="relative overflow-hidden aspect-video">
      <img
        src={course.image} alt={course.title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      {course.status === "in_progress" && (
        <div className="absolute top-3 left-3 bg-[#fec601] text-gray-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          🔥 限時 8 折
        </div>
      )}
      {course.status === "completed" && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white/95 rounded-full p-3">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
        </div>
      )}
    </div>
    <div className="p-4 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 flex-1">{course.title}</h3>
        <StatusBadge status={course.status} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <img src={course.avatar} alt={course.instructor} className="w-5 h-5 rounded-full" />
        <span className="text-xs text-gray-400">{course.instructor}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{course.tags[0]}</span>
        <span className="flex items-center text-[#fec601] font-bold">
          <Star size={11} fill="currentColor" />
          <span className="ml-1">{course.rating}</span>
          <span className="text-gray-300 font-normal ml-1">({course.reviews})</span>
        </span>
      </div>
      {course.status !== "not_started" && (
        <>
          <ProgressBar value={course.progress} />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-xs text-gray-400">學習進度</span>
            <span className="text-xs font-bold text-[#0e9888]">{course.progress}%</span>
          </div>
        </>
      )}
      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
        <div>
          <span className="text-[#0e9888] font-bold text-sm">NT$ {course.price.toLocaleString()}</span>
          <span className="text-xs text-gray-300 line-through ml-2">NT$ {course.originalPrice.toLocaleString()}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#0e9888] text-white text-xs rounded-xl font-semibold"
        >
          <PlayCircle size={14} /> 繼續學習
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// 收藏課程Card
const BookmarkCard = ({ course, index }) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.09)" }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
  >
    <div className="relative overflow-hidden aspect-video">
      <img
        src={course.image} alt={course.title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      <motion.button
        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
      >
        <Heart size={15} className="text-rose-500 fill-rose-500" />
      </motion.button>
    </div>
    <div className="p-4 flex flex-col flex-1">
      <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2">{course.title}</h3>
      <div className="flex items-center gap-2 mb-3">
        <img src={course.avatar} alt={course.instructor} className="w-5 h-5 rounded-full" />
        <span className="text-xs text-gray-400">{course.instructor}</span>
      </div>
      <div className="flex items-center justify-between text-xs mb-3">
        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{course.tags[0]}</span>
        <span className="flex items-center text-[#fec601] font-bold">
          <Star size={11} fill="currentColor" />
          <span className="ml-1">{course.rating}</span>
          <span className="text-gray-300 font-normal ml-1">({course.reviews})</span>
        </span>
      </div>
      <div className="text-xs text-gray-400 mb-3">已有 {course.students.toLocaleString()} 同學加入</div>
      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
        <div>
          <span className="text-[#0e9888] font-bold">NT$ {course.price.toLocaleString()}</span>
          <span className="text-xs text-gray-300 line-through ml-2">NT$ {course.originalPrice.toLocaleString()}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#0b7a6d" }} whileTap={{ scale: 0.9 }}
          className="p-2 bg-[#0e9888] text-white rounded-xl"
        >
          <ShoppingCart size={16} />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Portfolio Tab
const PortfolioTab = () => (
  <motion.div
    initial="hidden" animate="visible" variants={stagger}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
  >
    {[
      { title: "Python 爬蟲專案：自動抓取股市數據", tag: "程式開發", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
      { title: "響應式電商前端設計", tag: "網頁設計",  image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80" },
      { title: "JavaScript 互動遊戲：Tetris", tag: "程式開發", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80" },
      { title: "個人品牌 Logo 設計提案", tag: "藝術設計", image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80" },
      { title: "資料視覺化儀表板", tag: "數據分析",   image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
    ].map((item, i) => (
      <motion.div
        key={i} variants={fadeUp} custom={i}
        whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.10)" }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
      >
        <div className="aspect-video overflow-hidden">
          <img src={item.image} alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-sm text-gray-800 mb-2">{item.title}</h3>
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{item.tag}</span>
        </div>
      </motion.div>
    ))}
    <motion.button
      variants={fadeUp} custom={5}
      whileHover={{ y: -6, borderColor: "#0e9888" }}
      className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 text-gray-400 hover:text-[#0e9888] transition-colors min-h-[180px]"
    >
      <PlusCircle size={32} />
      <span className="text-sm font-semibold">新增作品</span>
    </motion.button>
  </motion.div>
);

// 主元件
// Props:
// activeTab              — 目前 tab key（由父層 Profile-component 管理）
// courseFilter           — 課程篩選狀態
// onCourseFilterChange   — 切換篩選的 callback
const StudentDashboard = ({ activeTab, courseFilter, onCourseFilterChange }) => {
  const filteredCourses = courseFilter === "all"
    ? STUDENT_COURSES
    : STUDENT_COURSES.filter(c => c.status === courseFilter);

  switch (activeTab) {
    case "courses":
      return (
        <div>
          <CourseSubTabs
            active={courseFilter}
            onChange={onCourseFilterChange}
            total={STUDENT_COURSES.length}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={courseFilter}
              initial="hidden" animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
            >
              {filteredCourses.map((c, i) => (
                <StudentCourseCard key={c.id} course={c} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      );

    case "bookmarks":
      return (
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {BOOKMARKED_COURSES.map((c, i) => (
            <BookmarkCard key={c.id} course={c} index={i} />
          ))}
        </motion.div>
      );

    case "portfolio":
      return <PortfolioTab />;

    default:
      return null;
  }
};

export default StudentDashboard;