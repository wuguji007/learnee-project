import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Users, ShoppingCart, ChevronLeft, ChevronRight,
  SlidersHorizontal, ArrowUpDown, Tag, Search, BookOpen, X
} from 'lucide-react';
import courseService from '../services/course.service';

// 類別badge顏色對照
const CATEGORY_COLORS = {
  "程式設計": "bg-orange-50 text-orange-600 border-orange-200",
  "數據分析": "bg-cyan-50   text-cyan-600   border-cyan-200",
  "投資理財": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "自我成長": "bg-pink-50   text-pink-600   border-pink-200",
  "拍攝剪輯": "bg-gray-100  text-gray-600   border-gray-200",
  "藝術設計": "bg-purple-50 text-purple-600 border-purple-200",
  "語言學習": "bg-teal-50   text-teal-600   border-teal-200",
  "音樂創作": "bg-violet-50 text-violet-600 border-violet-200",
  "烹飪料理": "bg-red-50    text-red-600    border-red-200",
  "創意寫作": "bg-indigo-50 text-indigo-600 border-indigo-200",
};

const SORT_OPTIONS = [
  { key: 'newest',  label: '最新課程' },
  { key: 'popular', label: '最高人氣' },
  { key: 'price',   label: '最低價格' },
];

const ITEMS_PER_PAGE = 12;

// 排序邏輯
function sortCourses(courses, sortKey) {
  const arr = [...courses];
  if (sortKey === 'popular') return arr.sort((a, b) => (b.students?.length ?? 0) - (a.students?.length ?? 0));
  if (sortKey === 'price')   return arr.sort((a, b) => a.price - b.price);
  // newest: 保持原始DB順序（按 _id 遞減，即最新插入優先）
  return arr.sort((a, b) => {
    const idA = a._id?.$oid ?? a._id ?? '';
    const idB = b._id?.$oid ?? b._id ?? '';
    return idB.localeCompare(idA);
  });
}

// 課程卡片
function CourseCard({ course, onAddToCart, index }) {
  const navigate    = useNavigate();
  const badgeClass  = CATEGORY_COLORS[course.category] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const originalPrice = Math.round(course.price * 1.4);
  const discount    = Math.round((1 - course.price / originalPrice) * 100);
  const courseId    = course._id?.$oid ?? course._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index % ITEMS_PER_PAGE, 7) * 0.05 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer group"
      onClick={() => navigate(`/courses/${courseId}`)}
    >
      {/* 課程image */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {course.image
          ? <motion.img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.4 }}
            />
          : <div className="w-full h-full bg-gradient-to-br from-[#0e9888]/10 to-[#fec601]/10 flex items-center justify-center">
              <BookOpen size={36} className="text-[#0e9888]/30" />
            </div>
        }
        {/* 折扣badge */}
        <div className="absolute top-2.5 left-2.5 bg-[#fec601] text-gray-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
          🔥 限時 {discount}% OFF
        </div>
      </div>

      {/* 內容 */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-[#0e9888] transition-colors">
          {course.title}
        </h3>

        {/* 講師 */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#0e9888]/15 flex items-center justify-center text-[9px] font-bold text-[#0e9888] flex-shrink-0">
            {(course.instructor?.username ?? '?')[0]?.toUpperCase()}
          </div>
          <span className="text-xs text-gray-500 truncate">
            {course.instructor?.username ?? '講師'}
          </span>
        </div>

        {/* Category + Rating */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
            {course.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-[#fec601] font-bold">
            <Star size={11} fill="currentColor" />
            <span>4.8</span>
            <span className="text-gray-300 font-normal">(325)</span>
          </div>
        </div>

        {/* 學生數 */}
        <p className="text-[11px] text-gray-400 flex items-center gap-1">
          <Users size={11} />
          已有 {(course.students?.length ?? 0).toLocaleString()} 位同學加入
        </p>

        {/* 價格 + 加入購物車 */}
        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-[#0e9888] font-black text-base">NT$ {course.price.toLocaleString()}</div>
            <div className="text-[11px] text-gray-300 line-through">NT$ {originalPrice.toLocaleString()}</div>
          </div>
          <motion.button
            onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
            whileHover={{ scale: 1.12, backgroundColor: "#0b7a6d" }}
            whileTap={{ scale: 0.88 }}
            className="p-2 bg-[#0e9888] text-white rounded-xl shadow-sm"
            title="加入購物車"
          >
            <ShoppingCart size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// 分頁元件
function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end   = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12">
      {/* 第一頁 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 disabled:opacity-30 hover:border-[#0e9888] hover:text-[#0e9888] transition-colors text-xs font-bold"
      >«</button>
      {/* 上一頁 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 disabled:opacity-30 hover:border-[#0e9888] hover:text-[#0e9888] transition-colors"
      ><ChevronLeft size={16} /></button>

      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
          : <motion.button
              key={p}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                p === currentPage
                  ? 'bg-[#0e9888] text-white shadow-md shadow-[#0e9888]/25'
                  : 'border border-gray-200 text-gray-500 hover:border-[#0e9888] hover:text-[#0e9888]'
              }`}
            >{p}</motion.button>
      )}

      {/* 下一頁 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 disabled:opacity-30 hover:border-[#0e9888] hover:text-[#0e9888] transition-colors"
      ><ChevronRight size={16} /></button>
      {/* 最後頁 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 disabled:opacity-30 hover:border-[#0e9888] hover:text-[#0e9888] transition-colors text-xs font-bold"
      >»</button>
    </div>
  );
}

// 主元件
export default function FoundCourseComponent({ setCartCount }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') ?? '';

  const [courses,     setCourses]     = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [sortKey,     setSortKey]     = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  // 頁面內搜尋框(可重新搜尋)
  const [inputVal, setInputVal] = useState(query);

  // call API
  const fetchCourses = useCallback(async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await courseService.getCourseByName(q.trim());
      setCourses(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error('搜尋課程失敗', err);
      setError('搜尋失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  }, []);

  // query 變動時自動重新搜尋
  useEffect(() => {
    setInputVal(query);
    if (query) fetchCourses(query);
  }, [query, fetchCourses]);

  // 重新搜尋
  const handleReSearch = (e) => {
    e.preventDefault();
    const q = inputVal.trim();
    if (!q) return;
    setSearchParams({ q });   // 更新 URL → 觸發 useEffect
  };

  // 計算分頁
  const sorted     = sortCourses(courses, sortKey);
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated  = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSortChange = (key) => {
    setSortKey(key);
    setCurrentPage(1);
  };
  const handleAddToCart = () => setCartCount(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gray-50/40">

      {/* 搜尋結果標題列 */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          {/* 搜尋框 */}
          <form onSubmit={handleReSearch} className="flex gap-2 max-w-xl mb-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="搜尋課程..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0e9888]/30 focus:border-[#0e9888] bg-gray-50"
              />
              {inputVal && (
                <button type="button" onClick={() => setInputVal('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X size={13} />
                </button>
              )}
            </div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 bg-[#0e9888] text-white text-sm font-bold rounded-xl hover:bg-[#0b7a6d] transition-colors"
            >搜尋</motion.button>
          </form>

          {/* 結果摘要 + 排序 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-base font-semibold text-gray-800">
              {loading ? (
                <span className="text-gray-400">搜尋中...</span>
              ) : error ? (
                <span className="text-rose-500">{error}</span>
              ) : (
                <>
                  查看 <span className="text-[#0e9888] font-black">{courses.length}</span> 筆與「
                  <span className="text-[#0e9888] font-black">「{query}」</span>
                  」的相關課程
                </>
              )}
            </div>

            {/* 排序tabs */}
            {!loading && courses.length > 0 && (
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => handleSortChange(opt.key)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      sortKey === opt.key
                        ? 'bg-white text-[#0e9888] shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >{opt.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Loading spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
              className="w-10 h-10 rounded-full border-4 border-[#0e9888]/20 border-t-[#0e9888]"
            />
            <p className="text-sm text-gray-400">搜尋中，請稍候…</p>
          </div>
        )}

        {/* if查無結果 */}
        {!loading && !error && courses.length === 0 && query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-5 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <Search size={32} className="text-gray-300" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-600 mb-1">找不到與「{query}」相關的課程</p>
              <p className="text-sm text-gray-400">試試其他關鍵字，或瀏覽我們的熱門課程</p>
            </div>
            <Link to="/" className="px-6 py-3 bg-[#0e9888] text-white text-sm font-bold rounded-xl hover:bg-[#0b7a6d] transition-colors">
              回首頁瀏覽課程
            </Link>
          </motion.div>
        )}

        {/* 課程格線 */}
        {!loading && paginated.length > 0 && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${query}-${sortKey}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {paginated.map((course, i) => (
                  <CourseCard
                    key={course._id?.$oid ?? course._id ?? i}
                    course={course}
                    onAddToCart={handleAddToCart}
                    index={i}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* 分頁 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}