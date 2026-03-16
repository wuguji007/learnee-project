// 共用 UI 元件：StatusBadge、ProgressBar、TabButton、StatCard、ProfileHeader、CourseSubTabs
import { motion } from "framer-motion";
import {
  BookOpen, Heart, Award, Users, BarChart2,
  PlusCircle, TrendingUp, Mic2, GraduationCap,
} from "lucide-react";
import { fadeUp, stagger, STUDENT_COURSES, BOOKMARKED_COURSES } from "./profile.constants";

// StatusBadge 
export const StatusBadge = ({ status }) => {
  const map = {
    "上架":      { label: "已上架",   color: "bg-emerald-100 text-emerald-600" },
    "未上架":    { label: "未上架",   color: "bg-yellow-100 text-yellow-600" },
    in_progress: { label: "進行中",   color: "bg-blue-100 text-blue-600" },
    completed:   { label: "已完課",   color: "bg-emerald-100 text-emerald-600" },
    not_started: { label: "等待開課", color: "bg-gray-100 text-gray-500" },
  };
  const s = map[status] || map["未上架"];
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>
      {s.label}
    </span>
  );
};

// ProgressBar
export const ProgressBar = ({ value }) => (
  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
    <motion.div
      className="h-full bg-gradient-to-r from-[#0e9888] to-[#23a495] rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
    />
  </div>
);

// TabBtn
export const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.97 }}
    className={`flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
      active
        ? "bg-[#0e9888] text-white shadow-md shadow-[#0e9888]/30"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    }`}
  >
    <Icon size={14} className="flex-shrink-0" />
    <span>{label}</span>
    {count !== undefined && (
      <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold ${
        active ? "bg-white/25 text-white" : "bg-gray-200 text-gray-500"
      }`}>{count}</span>
    )}
  </motion.button>
);

// StatCard
export const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div variants={fadeUp} custom={delay} className="text-center">
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

// Profile Header 
export const ProfileHeader = ({ user, isInstructor, activeTab, onTabChange, coursesCount }) => {
  const studentTabs = [
    { key: "courses",   icon: BookOpen,   label: "我的課程", count: STUDENT_COURSES.length },
    { key: "bookmarks", icon: Heart,      label: "我的收藏", count: BOOKMARKED_COURSES.length },
    { key: "portfolio", icon: Award,      label: "作品成果", count: 5 },
  ];
  const instructorTabs = [
    { key: "courses",   icon: BookOpen,   label: "我的課程",  count: coursesCount },
    { key: "create",    icon: PlusCircle, label: "建立新課程" },
    { key: "analytics", icon: BarChart2,  label: "數據分析" },
  ];
  const tabs = isInstructor ? instructorTabs : studentTabs;

  const studentStats = [
    { icon: BookOpen, label: "我的課程", value: STUDENT_COURSES.length,    color: "bg-blue-100 text-blue-600",   delay: 0 },
    { icon: Heart,    label: "我的收藏", value: BOOKMARKED_COURSES.length,  color: "bg-rose-100 text-rose-500",   delay: 1 },
    { icon: Award,    label: "作品成果", value: 5,                          color: "bg-amber-100 text-amber-500", delay: 2 },
  ];
  const instructorStats = [
    { icon: BookOpen,   label: "我的課程", value: coursesCount, color: "bg-blue-100 text-blue-600",        delay: 0 },
    { icon: Users,      label: "學生總數", value: "—",          color: "bg-purple-100 text-purple-600",    delay: 1 },
    { icon: TrendingUp, label: "已上架",   value: "—",          color: "bg-emerald-100 text-emerald-600",  delay: 2 },
  ];
  const stats = isInstructor ? instructorStats : studentStats;

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-0">
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6"
        >
          {/* Avatar */}
          <motion.div variants={fadeUp} className="relative flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-[#0e9888]/15"
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

          {/* Name + role */}
          <motion.div variants={fadeUp} className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {user?.username || "使用者"}
            </h1>
            <span className={`inline-flex items-center gap-1.5 mt-1 text-xs font-semibold px-3 py-1 rounded-full ${
              isInstructor ? "bg-amber-100 text-amber-700" : "bg-[#e6f5f2] text-[#0e9888]"
            }`}>
              {isInstructor
                ? <Mic2 size={12} strokeWidth={2.5} />
                : <GraduationCap size={12} strokeWidth={2.5} />
              }
              {isInstructor ? "講師" : "學員"}
            </span>
            <p className="text-xs text-gray-400 mt-1 truncate">{user?.email}</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger}
            className="flex items-center justify-center gap-6 sm:gap-10 sm:ml-auto w-full sm:w-auto"
          >
            {stats.map(s => <StatCard key={s.label} {...s} />)}
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1 sm:gap-2 pb-4 min-w-max sm:min-w-0 justify-center sm:justify-start">
            {tabs.map(tab => (
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

// 學生課程篩選SubTabs
export const CourseSubTabs = ({ active, onChange, total }) => {
  const tabs = [
    { key: "all",         label: `所有課程 (${total})` },
    { key: "in_progress", label: "正在上課中" },
    { key: "not_started", label: "等待開課" },
    { key: "completed",   label: "已完課" },
  ];
  return (
    <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
      <div className="flex items-center gap-4 sm:gap-6 border-b border-gray-100 min-w-max sm:min-w-0">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap ${
              active === t.key ? "text-[#0e9888]" : "text-gray-400 hover:text-gray-600"
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
    </div>
  );
};