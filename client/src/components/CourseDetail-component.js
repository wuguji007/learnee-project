import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Users, Clock, ChevronRight, ChevronDown, ChevronUp,
  ShoppingCart, Share2, Play, BookOpen, Award, CheckCircle,
  BarChart2, Globe, Tag, ArrowLeft
} from 'lucide-react';
import courseService from '../services/course.service';

// ── 類別對應 badge 顏色 ────────────────────────────────────────────────
const CATEGORY_COLORS = {
  "程式設計": "bg-orange-100 text-orange-700 border-orange-200",
  "數據分析": "bg-cyan-100   text-cyan-700   border-cyan-200",
  "投資理財": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "自我成長": "bg-pink-100   text-pink-700   border-pink-200",
  "拍攝剪輯": "bg-gray-100   text-gray-700   border-gray-200",
  "藝術設計": "bg-purple-100 text-purple-700 border-purple-200",
  "語言學習": "bg-teal-100   text-teal-700   border-teal-200",
  "音樂創作": "bg-violet-100 text-violet-700 border-violet-200",
  "烹飪料理": "bg-red-100    text-red-700    border-red-200",
  "創意寫作": "bg-indigo-100 text-indigo-700 border-indigo-200",
};
const DEFAULT_BADGE = "bg-gray-100 text-gray-700 border-gray-200";

// ── 計算課程總時數 ─────────────────────────────────────────────────────
function calcTotalDuration(chapters = []) {
  let totalSec = 0;
  chapters.forEach(ch => {
    (ch.units || []).forEach(u => {
      const parts = (u.duration || "0:00").split(':').map(Number);
      if (parts.length === 3) totalSec += parts[0] * 3600 + parts[1] * 60 + parts[2];
      else if (parts.length === 2) totalSec += parts[0] * 60 + parts[1];
    });
  });
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return h > 0 ? `${h} 時 ${m} 分` : `${m} 分`;
}

function calcTotalUnits(chapters = []) {
  return chapters.reduce((acc, ch) => acc + (ch.units?.length || 0), 0);
}

// 課程章節手風琴
function ChapterItem({ chapter, index, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#04d197] rounded-2xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-[#e6f5f2]/70 transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-[#0e9888]/10 text-[#0e9888] text-xs font-bold flex items-center justify-center flex-shrink-0">
            {index + 1}
          </span>
          <span className="font-semibold text-gray-800 text-sm">{chapter.title}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <span className="text-xs text-gray-400 hidden sm:block">
            {chapter.units?.length || 0} 單元
          </span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronUp size={18} className="text-gray-400 group-hover:text-[#0e9888] transition-colors" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="divide-y divide-gray-50 bg-white">
              {(chapter.units || []).map((unit, ui) => (
                <li key={ui} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/60 transition-colors group/unit">
                  <div className="flex items-center gap-3 min-w-0">
                    <Play size={14} className="text-[#0e9888]/50 flex-shrink-0 group-hover/unit:text-[#0e9888] transition-colors" />
                    <span className="text-sm text-gray-600 truncate">{unit.title}</span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-3 font-mono">{unit.duration}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 右側購買panel
function PurchasePanel({ course, onAddToCart }) {
  const discountPrice = course.price;
  const originalPrice = Math.round(course.price * 1.4);
  const discount      = Math.round((1 - discountPrice / originalPrice) * 100);

  return (
    <div className="sticky top-6 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* 課程圖片縮圖 */}
      {course.image && (
        <div className="relative h-44 overflow-hidden">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="bg-[#fec601] text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">
              🔥 限時 {discount}% OFF
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* 價格 */}
        <div className="flex items-end gap-2 mb-1">
          <span className="text-3xl font-black text-[#0e9888]">NT$ {discountPrice.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-sm text-gray-400 line-through">NT$ {originalPrice.toLocaleString()}</span>
          <span className="text-sm font-bold text-rose-500">省 NT$ {(originalPrice - discountPrice).toLocaleString()}</span>
        </div>

        {/* CTA 按鈕 */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 12px 32px rgba(14,152,136,0.35)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-[#0e9888] hover:bg-[#0b7a6d] text-white font-bold rounded-2xl text-base mb-3 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#0e9888]/20"
        >
          <ShoppingCart size={18} />
          立即購買
        </motion.button>
        <motion.button
          onClick={onAddToCart}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3.5 border-2 border-[#0e9888] text-[#0e9888] hover:bg-[#e6f5f2] font-semibold rounded-2xl text-sm transition-colors"
        >
          加入購物車
        </motion.button>

        {/* 課程資訊 */}
        <div className="mt-5 space-y-2.5 text-sm text-gray-600">
          <div className="flex items-center gap-2.5">
            <Clock size={15} className="text-[#0e9888] flex-shrink-0" />
            <span>總時數 {calcTotalDuration(course.chapters)}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <BookOpen size={15} className="text-[#0e9888] flex-shrink-0" />
            <span>{course.chapters?.length || 0} 章節・{calcTotalUnits(course.chapters)} 單元</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Users size={15} className="text-[#0e9888] flex-shrink-0" />
            <span>{(course.students?.length || 0).toLocaleString()} 位同學已加入</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Globe size={15} className="text-[#0e9888] flex-shrink-0" />
            <span>終身存取</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Award size={15} className="text-[#0e9888] flex-shrink-0" />
            <span>完課頒發結業證書</span>
          </div>
        </div>

        {/* 分享 */}
        <button className="mt-5 w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-[#0e9888] transition-colors py-2">
          <Share2 size={13} />
          分享這堂課程
        </button>
      </div>
    </div>
  );
}

// 主元件
export default function CourseDetail({ setCartCount }) {
  
    const { id } = useParams();
    const navigate    = useNavigate();
    const [course, setCourse]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [activeTab, setActiveTab] = useState('intro'); // intro | chapters | instructor

    useEffect(() => {
      setLoading(true);
      courseService.getCourseById(id)
          .then(res => setCourse(res.data))
          .catch(err => {
              console.error('課程取得失敗', err);
              setError('找不到課程，請稍後再試。');
          })
            .finally(() => setLoading(false));
    }, [id]);

  const handleAddToCart = () => {
    if (setCartCount) setCartCount(prev => prev + 1);
  };

  // Loading 
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-4 border-[#0e9888]/20 border-t-[#0e9888]"
      />
    </div>
  );

  // Error
  if (error || !course) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white text-gray-500">
      <BookOpen size={48} className="text-gray-200" />
      <p>{error || '課程不存在'}</p>
      <button onClick={() => navigate(-1)} className="text-[#0e9888] underline text-sm">返回上一頁</button>
    </div>
  );

  const totalDuration = calcTotalDuration(course.chapters);
  const totalUnits    = calcTotalUnits(course.chapters);
  const badgeClass    = CATEGORY_COLORS[course.category] ?? DEFAULT_BADGE;

 
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">

      {/* 麵包屑 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#0e9888] transition-colors">所有課程</Link>
          <ChevronRight size={12} />
          <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${badgeClass}`}>
            {course.category}
          </span>
          <ChevronRight size={12} />
          <span className="text-gray-600 line-clamp-1">{course.title}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#0e9888]/20 bg-gradient-to-br from-[#0e9888]/90 to-transparent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

            {/* 左側文字 */}
            <motion.div
              className="flex-1 min-w-0"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 border ${badgeClass}`}>
                {course.category}
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white [text-shadow:_2px_2px_6px_rgb(0_0_0_/_0.5)] leading-tight mb-4">
                {course.title}
              </h1>

              <p className="text-gray-700 text-sm sm:text-base font-semibold leading-relaxed mb-6 line-clamp-3">
                {course.description}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-1.5 text-[#fec601]">
                  <Star size={15} fill="currentColor" />
                  <span className="font-bold">4.8</span>
                  <span className="text-gray-600 font-normal">(325 則評價)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Users size={15} />
                  <span>{(course.students?.length || 0).toLocaleString()} 位學生</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock size={15} />
                  <span>總時數 {totalDuration}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <BookOpen size={15} />
                  <span>{course.chapters?.length || 0} 章・{totalUnits} 單元</span>
                </div>
              </div>
            </motion.div>

            {/* 右側縮圖(Desktop隱藏，右側panel顯示；mobile顯示）*/}
            {course.image && (
              <motion.div
                className="w-full lg:hidden rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className='w-full relative'>

        {/* 網格背景 */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            // 定義網格的線條顏色與粗細
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), 
              linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
            `,
            // 定義網格大小
            backgroundSize: '40px 40px',
          }}
        />
      
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="relative flex flex-col lg:flex-row gap-10 items-start">

            {/* 左欄panel */}
            <div className="bg-white flex-1 min-w-0 rounded-3xl border border-[#0e9888]/10 p-4 shadow-xl">

              {/* Tab導覽 */}
              <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-8 w-fit">
                {[
                  { key: 'intro',      label: '課程介紹' },
                  { key: 'chapters',   label: '課程章節' },
                  { key: 'instructor', label: '關於講師' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === tab.key
                        ? 'bg-white text-[#0e9888] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">                        

                {/* 課程介紹Tab */}
                {activeTab === 'intro' && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* 課程圖片 */}
                    {course.image && (
                      <div className="rounded-3xl overflow-hidden mb-8 shadow-lg">
                        <img src={course.image} alt={course.title} className="w-full h-64 sm:h-80 object-cover" />
                      </div>
                    )}

                    {/* 課程介紹 */}
                    <section className="mb-8 px-2">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-5">
                        <Star size={20} fill="#fec601" className="text-[#fec601]" />
                        課程介紹
                      </h2>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                        {course.description}
                      </p>
                    </section>

                                    
                      {/* 課程狀態badge */}
                      <div className="flex items-center gap-2 flex-wrap px-2 mb-4">
                          <Tag size={14} className="text-gray-400" />
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                              {course.category}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              course.status === '上架'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>
                              {course.status}
                          </span>
                      </div>


                    {/* 課程數據 */}
                    <section className="mb-10 px-2">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-5">
                        <BarChart2 size={20} className="text-[#0e9888]" />
                        課程資訊
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { icon: Users,    value: (course.students?.length || 0).toLocaleString(), label: '已報名學生' },
                          { icon: Clock,    value: totalDuration,                                    label: '總課程時數' },
                          { icon: BookOpen, value: `${course.chapters?.length || 0} 章`,             label: '課程章節' },
                          { icon: Play,     value: `${totalUnits} 單元`,                             label: '影音單元' },
                        ].map(({ icon: Icon, value, label }) => (
                          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center shadow-sm hover:shadow-md transition-shadow">
                            <Icon size={22} className="text-[#0e9888] mx-auto mb-2" />
                            <div className="text-lg font-black text-gray-800">{value}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </motion.div>
                )}

                {/* 課程章節Tab */}
                {activeTab === 'chapters' && (
                  <motion.div
                    key="chapters"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between px-2 mb-5">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen size={20} className="text-[#0e9888]" />
                        課程章節
                      </h2>
                      <span className="text-sm text-gray-400">
                        共 {course.chapters?.length || 0} 章・{totalUnits} 單元・{totalDuration}
                      </span>
                    </div>

                    {/* 手風琴 */}
                    {course.chapters?.length > 0 ? (
                      <div>
                        {course.chapters.map((ch, i) => (
                          <ChapterItem key={i} chapter={ch} index={i} defaultOpen={i === 0} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-gray-400">
                        <BookOpen size={40} className="mx-auto mb-3 text-gray-200" />
                        <p>課程章節尚未建立</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 講師介紹Tab */}
                {activeTab === 'instructor' && (
                  <motion.div
                    key="instructor"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                      <Award size={20} className="text-[#0e9888]" />
                      關於講師
                    </h2>
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                      {/* 講師基本資料 (!! instructor populate 後會有 username & avatar) */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#0e9888]/10 flex items-center justify-center flex-shrink-0">
                          {course.instructor?.avatar
                            ? <img src={course.instructor.avatar} alt="instructor" className="w-full h-full object-cover rounded-2xl" />
                            : <span className="text-2xl font-black text-[#0e9888]">
                                {(course.instructor?.username ?? '?')[0].toUpperCase()}
                              </span>
                          }
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">
                            {course.instructor?.username ?? '講師'}
                          </div>
                          <div className="text-sm text-gray-400 mt-0.5">{course.category} 專業講師</div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Star size={12} fill="#fec601" className="text-[#fec601]" /> 4.8
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {(course.students?.length || 0).toLocaleString()} 位學生
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen size={12} />
                              {course.chapters?.length || 0} 堂課程
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        {course.instructor?.username ?? '這位講師'}
                        {'  '}是本平台嚴選的專業講師，具備豐富的業界實戰經驗與教學熱忱。
                        課程內容理論與實務並重，深受學員好評，致力於幫助每位同學以最有效率的方式掌握核心技能。
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6 px-6 py-3 bg-[#0e9888] text-white text-sm font-semibold rounded-xl hover:bg-[#0b7a6d] transition-colors"
                      >
                        探索更多講師課程 →
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 右欄：購買panel(Desktop) */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 hidden lg:block">
              <PurchasePanel course={course} onAddToCart={handleAddToCart} />
            </div>
          </div>
        </div>

        {/* Mobile底部sticky購買panel */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3 shadow-2xl z-50">
        <div>
          <div className="text-lg font-black text-[#0e9888]">NT$ {course.price.toLocaleString()}</div>
          <div className="text-xs text-gray-400 line-through">NT$ {Math.round(course.price * 1.4).toLocaleString()}</div>
        </div>
        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-3.5 bg-[#0e9888] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0e9888]/20"
        >
          <ShoppingCart size={16} />
          立即購買
        </motion.button>
        </div>

      </div>
    </div>
  );
}