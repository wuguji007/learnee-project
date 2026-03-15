import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, BookOpen, Heart, Award, PlusCircle,
  Users, BarChart2, Edit3, Trash2, Eye,
  CheckCircle, Clock, PlayCircle, TrendingUp,
  Bookmark, ShoppingCart, Upload
} from 'lucide-react';
 
// ─── Mock Data ───────────────────────────────────────────────────────────────
 
const STUDENT_COURSES = [
  {
    id: 2,
    title: "小白也會！從零開始學習 Python 程式設計",
    instructor: "Kelly Hsu",
    price: 2480,
    originalPrice: 3200,
    rating: 4.0, reviews: 333, students: 420,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    progress: 68, status: "in_progress"
  },
  {
    id: 3,
    title: "全面掌握 JavaScript 開發技術",
    instructor: "Kelly Hsu",
    price: 2480, originalPrice: 3200,
    rating: 4.0, reviews: 333, students: 420,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    progress: 20, status: "not_started"
  },
  {
    id: 4,
    title: "HTML & CSS 網頁設計基礎教程",
    instructor: "Kelly Hsu",
    price: 2480, originalPrice: 3200,
    rating: 4.0, reviews: 333, students: 420,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    progress: 100, status: "completed"
  },
  {
    id: 9,
    title: "更進一步！深入學習 Node.js 與後端開發",
    instructor: "Kelly Hsu",
    price: 2480, originalPrice: 3200,
    rating: 4.0, reviews: 333, students: 420,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    progress: 0, status: "not_started"
  }
];
 
const BOOKMARKED_COURSES = [
  {
    id: 6,
    title: "UI/UX 設計入門：打造令人愛不釋手的產品",
    instructor: "Anny Lin",
    price: 2880, originalPrice: 3600,
    rating: 4.9, reviews: 748, students: 1205,
    tags: ["藝術設計"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg"
  },
  {
    id: 8,
    title: "吉他從零開始：30 天學會你最愛的流行歌曲",
    instructor: "K. Lee",
    price: 1280, originalPrice: 1800,
    rating: 4.8, reviews: 923, students: 2100,
    tags: ["音樂創作"],
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  }
];
 
const INSTRUCTOR_COURSES = [
  {
    id: 101,
    title: "React 前端工程師實戰營：從元件到完整應用",
    price: 3200, originalPrice: 4200,
    rating: 4.8, reviews: 512, students: 1340,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    revenue: 42880, status: "published"
  },
  {
    id: 102,
    title: "TypeScript 完整指南：讓你的 JavaScript 更強大",
    price: 2800, originalPrice: 3600,
    rating: 4.6, reviews: 289, students: 870,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    revenue: 24360, status: "published"
  },
  {
    id: 103,
    title: "Node.js 後端開發完全攻略",
    price: 2980, originalPrice: 3800,
    rating: 0, reviews: 0, students: 0,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    revenue: 0, status: "draft"
  }
];
 
// ─── Animation Variants ───────────────────────────────────────────────────────
 
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
  })
};
 
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
};
 
// ─── Shared Sub-components ────────────────────────────────────────────────────
 
const StatusBadge = ({ status }) => {
  const map = {
    in_progress: { label: "進行中", color: "bg-blue-100 text-blue-600" },
    completed:   { label: "已完課", color: "bg-emerald-100 text-emerald-600" },
    not_started: { label: "等待開課", color: "bg-gray-100 text-gray-500" },
    published:   { label: "已發佈", color: "bg-emerald-100 text-emerald-600" },
    draft:       { label: "草稿", color: "bg-yellow-100 text-yellow-600" }
  };
  const s = map[status] || map.not_started;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
  );
};
 
const ProgressBar = ({ value }) => (
  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
    <motion.div
      className="h-full bg-gradient-to-r from-[#0e9888] to-[#23a495] rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
    />
  </div>
);
 
// ─── Course Card: Student ─────────────────────────────────────────────────────
 
const StudentCourseCard = ({ course, index }) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(14,152,136,0.13)" }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
  >
    <div className="relative overflow-hidden aspect-video">
      <img src={course.image} alt={course.title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#0e9888] text-white text-xs rounded-xl font-semibold"
        >
          <PlayCircle size={14} /> 繼續學習
        </motion.button>
      </div>
    </div>
  </motion.div>
);
 
// ─── Course Card: Bookmarked ──────────────────────────────────────────────────
 
const BookmarkCard = ({ course, index }) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.09)" }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
  >
    <div className="relative overflow-hidden aspect-video">
      <img src={course.image} alt={course.title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
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
          whileHover={{ scale: 1.1, backgroundColor: "#0b7a6d" }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-[#0e9888] text-white rounded-xl"
        >
          <ShoppingCart size={16} />
        </motion.button>
      </div>
    </div>
  </motion.div>
);
 
// ─── Course Card: Instructor ──────────────────────────────────────────────────
 
const InstructorCourseCard = ({ course, index }) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(14,152,136,0.12)" }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
  >
    <div className="relative overflow-hidden aspect-video">
      <img src={course.image} alt={course.title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      <div className="absolute top-3 left-3">
        <StatusBadge status={course.status} />
      </div>
    </div>
    <div className="p-4 flex flex-col flex-1">
      <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-3">{course.title}</h3>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-sm font-bold text-gray-800">{course.students.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400">學生</div>
        </div>
        <div className="text-center border-x border-gray-100">
          <div className="text-sm font-bold text-[#fec601]">
            {course.rating > 0 ? course.rating : "—"}
          </div>
          <div className="text-[10px] text-gray-400">評分</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-[#0e9888]">
            {course.revenue > 0 ? `NT$${(course.revenue / 1000).toFixed(0)}K` : "—"}
          </div>
          <div className="text-[10px] text-gray-400">收益</div>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2 border-t border-gray-50 pt-3">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 text-xs rounded-xl font-medium hover:border-[#0e9888] hover:text-[#0e9888] transition-colors"
        >
          <Edit3 size={13} /> 編輯
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 text-xs rounded-xl font-medium hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <Eye size={13} /> 預覽
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="p-2 border border-gray-200 text-gray-400 rounded-xl hover:border-rose-400 hover:text-rose-400 transition-colors"
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </div>
  </motion.div>
);
 
// ─── Tab Button ───────────────────────────────────────────────────────────────
 
const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.97 }}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
      active
        ? "bg-[#0e9888] text-white shadow-md shadow-[#0e9888]/30"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    }`}
  >
    <Icon size={16} />
    {label}
    {count !== undefined && (
      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
        active ? "bg-white/25 text-white" : "bg-gray-200 text-gray-500"
      }`}>{count}</span>
    )}
  </motion.button>
);
 
// ─── Stat Card ────────────────────────────────────────────────────────────────
 
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    className="text-center"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 400 }}
      className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mx-auto mb-1`}
    >
      <Icon size={18} />
    </motion.div>
    <div className="text-2xl font-black text-gray-900">{value}</div>
    <div className="text-xs text-gray-400 mt-0.5">{label}</div>
  </motion.div>
);
 
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
//       {/* Top bar */}
//       <div className="max-w-6xl mx-auto px-6 pt-8 pb-6">
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={stagger}
//           className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
//         >
//           {/* Avatar */}
//           <motion.div variants={fadeUp} className="relative">
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
 
//           {/* Name + role */}
//           <motion.div variants={fadeUp} className="flex-1 min-w-0">
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
//             <p className="text-xs text-gray-400 mt-1 truncate">{user?.email || "jessica@example.com"}</p>
//           </motion.div>
 
//           {/* Stats */}
//           <motion.div
//             variants={stagger}
//             className="flex items-center gap-8 sm:gap-10 ml-auto"
//           >
//             {stats.map((s) => (
//               <StatCard key={s.label} {...s} />
//             ))}
//           </motion.div>
//         </motion.div>
//       </div>
 
//       {/* Tabs */}
//       <div className="max-w-6xl mx-auto px-6 pb-0">
//         <div className="flex items-center gap-2 border-b border-transparent pb-4">
//           {tabs.map((tab) => (
//             <TabButton
//               key={tab.key}
//               active={activeTab === tab.key}
//               onClick={() => onTabChange(tab.key)}
//               icon={tab.icon}
//               label={tab.label}
//               count={tab.count}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
 
// ─── Profile Header ───────────────────────────────────────────────────────────
 
const ProfileHeader = ({ user, isInstructor, activeTab, onTabChange }) => {
  const studentTabs = [
    { key: "courses",   icon: BookOpen, label: "我的課程",  count: 4 },
    { key: "bookmarks", icon: Bookmark, label: "我的收藏",  count: 2 },
    { key: "portfolio", icon: Award,    label: "作品成果",  count: 5 }
  ];
  const instructorTabs = [
    { key: "courses",   icon: BookOpen,    label: "我的課程",  count: 3 },
    { key: "publish",   icon: Upload,      label: "發佈課程" },
    { key: "analytics", icon: BarChart2,   label: "數據分析" }
  ];
  const tabs = isInstructor ? instructorTabs : studentTabs;
 
  const studentStats = [
    { icon: BookOpen,    label: "我的課程", value: 4,   color: "bg-blue-100 text-blue-600",    delay: 0 },
    { icon: Heart,       label: "我的收藏", value: 2,   color: "bg-rose-100 text-rose-500",    delay: 1 },
    { icon: Award,       label: "作品成果", value: 5,   color: "bg-amber-100 text-amber-500",  delay: 2 }
  ];
  const instructorStats = [
    { icon: BookOpen,    label: "發佈課程", value: 2,      color: "bg-blue-100 text-blue-600",    delay: 0 },
    { icon: Users,       label: "學生總數", value: "2.2K", color: "bg-purple-100 text-purple-600",delay: 1 },
    { icon: TrendingUp,  label: "總收益",   value: "67K",  color: "bg-emerald-100 text-emerald-600", delay: 2 }
  ];
  const stats = isInstructor ? instructorStats : studentStats;
 
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-0">
 
        {/* ── Mobile: 全置中縱向堆疊 / Desktop: 橫向並排 ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6"
        >
          {/* Avatar */}
          <motion.div variants={fadeUp} className="relative flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="w-20 h-20 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-[#0e9888]/15"
            >
              <img
                src={`https://randomuser.me/api/portraits/${isInstructor ? "women" : "men"}/44.jpg`}
                alt={user?.username}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {isInstructor && (
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#fec601] rounded-full flex items-center justify-center shadow">
                <Award size={12} className="text-white" />
              </div>
            )}
          </motion.div>
 
          {/* Name + role — 手機置中，桌面靠左 */}
          <motion.div variants={fadeUp} className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {user?.username || "Jessica"}
            </h1>
            <span className={`inline-block mt-1 text-xs font-semibold px-3 py-1 rounded-full ${
              isInstructor
                ? "bg-amber-100 text-amber-700"
                : "bg-[#e6f5f2] text-[#0e9888]"
            }`}>
              {isInstructor ? "✨ 講師" : "🎓 學員"}
            </span>
            <p className="text-xs text-gray-400 mt-1 truncate">
              {user?.email || "jessica@example.com"}
            </p>
          </motion.div>
 
          {/* Stats — 手機置中橫排，桌面推到右側 */}
          <motion.div
            variants={stagger}
            className="flex items-center justify-center gap-6 sm:gap-10 sm:ml-auto w-full sm:w-auto"
          >
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </motion.div>
        </motion.div>
 
        {/* Tabs — 手機可橫向捲動，桌面正常顯示 */}
        <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1 sm:gap-2 pb-0 min-w-max sm:min-w-0 justify-center sm:justify-start">
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                onClick={() => onTabChange(tab.key)}
                icon={tab.icon}
                label={tab.label}
                count={tab.count}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};







// ─── Sub-tab filter for "我的課程" (student) ──────────────────────────────────
 
const CourseSubTabs = ({ active, onChange, total }) => {
  const tabs = [
    { key: "all",         label: `所有課程 (${total})` },
    { key: "in_progress", label: "正在上課中" },
    { key: "not_started", label: "等待開課" },
    { key: "completed",   label: "已完課" }
  ];
  return (
    <div className="flex items-center gap-6 mb-6 border-b border-gray-100">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            active === t.key
              ? "text-[#0e9888]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {t.label}
          {active === t.key && (
            <motion.div
              layoutId="course-sub-tab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0e9888] rounded-full"
            />
          )}
        </button>
      ))}
    </div>
  );
};
 
// ─── Portfolio Placeholder ────────────────────────────────────────────────────
 
const PortfolioTab = () => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={stagger}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
  >
    {[
      { title: "Python 爬蟲專案：自動抓取股市數據", tag: "程式開發",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
      { title: "響應式電商前端設計", tag: "網頁設計",
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80" },
      { title: "JavaScript 互動遊戲：Tetris 俄羅斯方塊", tag: "程式開發",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80" },
      { title: "個人品牌 Logo 設計提案", tag: "藝術設計",
        image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80" },
      { title: "資料視覺化儀表板", tag: "數據分析",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
    ].map((item, i) => (
      <motion.div
        key={i}
        variants={fadeUp}
        custom={i}
        whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.10)" }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
      >
        <div className="aspect-video overflow-hidden">
          <img src={item.image} alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-108" />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-sm text-gray-800 mb-2">{item.title}</h3>
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{item.tag}</span>
        </div>
      </motion.div>
    ))}
    {/* Add new */}
    <motion.button
      variants={fadeUp}
      custom={5}
      whileHover={{ y: -6, borderColor: "#0e9888" }}
      className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 text-gray-400 hover:text-[#0e9888] transition-colors min-h-[180px]"
    >
      <PlusCircle size={32} />
      <span className="text-sm font-semibold">新增作品</span>
    </motion.button>
  </motion.div>
);
 
// ─── Analytics Tab (Instructor) ───────────────────────────────────────────────
 
const AnalyticsTab = () => (
  <motion.div initial="hidden" animate="visible" variants={stagger}>
    <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { label: "總學生數", value: "2,210", icon: Users, color: "bg-purple-100 text-purple-600" },
        { label: "本月新增", value: "+148", icon: TrendingUp, color: "bg-emerald-100 text-emerald-600" },
        { label: "平均評分", value: "4.7", icon: Star, color: "bg-amber-100 text-amber-600" },
        { label: "總收益", value: "NT$67K", icon: BarChart2, color: "bg-blue-100 text-blue-600" }
      ].map((s, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          custom={i}
          whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.08)" }}
          className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4"
        >
          <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <s.icon size={20} />
          </div>
          <div>
            <div className="text-xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
 
    {/* Revenue by course */}
    <motion.div variants={fadeUp} custom={1} className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-800 mb-4">各課程收益分析</h3>
      {INSTRUCTOR_COURSES.filter(c => c.status === "published").map((c, i) => (
        <div key={c.id} className="mb-4 last:mb-0">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-medium text-gray-700 truncate mr-4">{c.title}</span>
            <span className="font-bold text-[#0e9888] flex-shrink-0">NT$ {c.revenue.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0e9888] to-[#23a495] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(c.revenue / 50000) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: i * 0.15 + 0.3 }}
            />
          </div>
        </div>
      ))}
    </motion.div>
  </motion.div>
);
 
// ─── Publish Tab ──────────────────────────────────────────────────────────────
 
const PublishTab = () => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeUp}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <motion.div
      whileHover={{ scale: 1.08, rotate: 3 }}
      transition={{ type: "spring", stiffness: 350 }}
      className="w-20 h-20 bg-[#e6f5f2] rounded-3xl flex items-center justify-center mb-6"
    >
      <Upload size={36} className="text-[#0e9888]" />
    </motion.div>
    <h2 className="text-2xl font-black text-gray-900 mb-3">發佈新課程</h2>
    <p className="text-gray-400 text-sm max-w-xs mb-8">分享你的專業知識，幫助更多學生成長</p>
    <motion.button
      whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(14,152,136,0.35)" }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-8 py-3.5 bg-[#0e9888] text-white rounded-2xl font-bold text-sm shadow-md"
    >
      <PlusCircle size={18} /> 開始建立課程
    </motion.button>
  </motion.div>
);



// ─── Main ProfileComponent ────────────────────────────────────────────────────
 
const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  const isInstructor = currentUser?.user?.role === "instructor";
  const defaultTab = "courses";
 
  const [activeTab, setActiveTab]       = useState(defaultTab);
  const [courseFilter, setCourseFilter] = useState("all");
 
  if (!currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
 
  // Filter student courses
  const filteredCourses = courseFilter === "all"
    ? STUDENT_COURSES
    : STUDENT_COURSES.filter(c => c.status === courseFilter);
 
  const renderContent = () => {
    if (!isInstructor) {
      // ── Student ──
      switch (activeTab) {
        case "courses":
          return (
            <div>
              <CourseSubTabs
                active={courseFilter}
                onChange={setCourseFilter}
                total={STUDENT_COURSES.length}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={courseFilter}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                  variants={stagger}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
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
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {BOOKMARKED_COURSES.map((c, i) => (
                <BookmarkCard key={c.id} course={c} index={i} />
              ))}
            </motion.div>
          );
        case "portfolio":
          return <PortfolioTab />;
        default: return null;
      }
    } else {
      // ── Instructor ──
      switch (activeTab) {
        case "courses":
          return (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {INSTRUCTOR_COURSES.map((c, i) => (
                <InstructorCourseCard key={c.id} course={c} index={i} />
              ))}
              <motion.button
                variants={fadeUp}
                custom={INSTRUCTOR_COURSES.length}
                whileHover={{ y: -6, borderColor: "#0e9888" }}
                className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 text-gray-400 hover:text-[#0e9888] transition-colors min-h-[260px]"
              >
                <PlusCircle size={36} />
                <span className="text-sm font-semibold">新增課程</span>
              </motion.button>
            </motion.div>
          );
        case "publish":   return <PublishTab />;
        case "analytics": return <AnalyticsTab />;
        default: return null;
      }
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Background grid overlay (matches Home) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.025) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.025) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)"
        }}
      />
 
      <div className="relative z-10">
        {/* Header with profile info + tabs */}
        <ProfileHeader
          user={currentUser?.user}
          isInstructor={isInstructor}
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); setCourseFilter("all"); }}
        />
 
        {/* Content area */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
 
export default ProfileComponent;