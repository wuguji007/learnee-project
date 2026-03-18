// 講師 Dashboard：CourseForm、DeleteModal、InstructorCourseCard、InstructorCoursesTab、CreateCourseTab、AnalyticsTab
// Props: currentUser, activeTab, courses, onCourseCreated
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star, BookOpen, Users, BarChart2, Edit3, Trash2, Eye,
    CheckCircle, TrendingUp, X, AlertTriangle, Save,
    ChevronDown, Loader2, FileText, PlusCircle, LockKeyhole, BookOpenCheck
} from "lucide-react";
import CourseService from "../services/course.service";
import { fadeUp, stagger, CATEGORY_OPTIONS, CATEGORY_IMAGES } from "./profile.constants";
import { StatusBadge } from "./profile-shared";

// 表單驗證Validation
const validate = (fields) => {
  const errors = {};
  if (!fields.title?.trim())
    errors.title = "課程名稱為必填";
  else if (fields.title.trim().length < 5)
    errors.title = "課程名稱至少 5 個字";

  if (!fields.description?.trim())
    errors.description = "課程介紹為必填";
  else if (fields.description.trim().length < 10)
    errors.description = "課程介紹至少 10 個字";

  const price = Number(fields.price);
  if (fields.price === "" || fields.price === undefined || fields.price === null)
    errors.price = "課程金額為必填";
  else if (isNaN(price) || price < 0)
    errors.price = "請輸入有效金額";
  else if (price >= 10000)
    errors.price = "課程金額上限為 NT$ 9,999";

  if (!fields.category)
    errors.category = "請選擇課程類別";

  return errors;
};

// 確認刪除課程Modal
const DeleteModal = ({ course, onConfirm, onCancel, loading, error }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
  >
    <motion.div
      initial={{ scale: 0.88, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full"
    >
      <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <AlertTriangle size={28} className="text-rose-500" />
      </div>
      <h3 className="text-lg font-black text-gray-900 text-center mb-2">確認刪除課程？</h3>
      <p className="text-sm text-gray-500 text-center mb-1">
        即將刪除：<span className="font-semibold text-gray-700">「{course?.title}」</span>
      </p>
      <p className="text-xs text-rose-400 text-center mb-7">此操作無法復原，課程資料將永久消失。</p>
      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl px-4 py-3 mb-5 text-xs">
          <AlertTriangle size={14} className="flex-shrink-0" />
          {error}
        </div>
      )}
      <div className="flex gap-3">
        <motion.button
          onClick={onCancel} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          取消
        </motion.button>
        <motion.button
          onClick={onConfirm} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="flex-1 py-3 bg-rose-500 text-white rounded-2xl font-semibold text-sm hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> 刪除中...</> : <><Trash2 size={16} /> 確認刪除</>}
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

// 課程表單
const EMPTY_FORM = {
  title: "", description: "", price: "",
  category: "", status: "未上架", chapters: [],
};

const CourseForm = ({ initial = null, onSubmit, onCancel, loading }) => {
  const isEdit = !!initial;

  const titleRef    = useRef(null);
  const descRef     = useRef(null);
  const priceRef    = useRef(null);
  const categoryRef = useRef(null);

  const [fields, setFields] = useState(
    isEdit
      ? { title: initial.title, description: initial.description, price: initial.price,
          category: initial.category, status: initial.status, chapters: initial.chapters || [] }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const set = (key, val) => {
    setFields(f => ({ ...f, [key]: val }));
    if (touched[key]) {
      const e = validate({ ...fields, [key]: val });
      setErrors(prev => ({ ...prev, [key]: e[key] }));
    }
  };

  const blur = (key) => {
    setTouched(t => ({ ...t, [key]: true }));
    const e = validate(fields);
    setErrors(prev => ({ ...prev, [key]: e[key] }));
  };

  const handleSubmit = () => {
    const allTouched = Object.fromEntries(Object.keys(EMPTY_FORM).map(k => [k, true]));
    setTouched(allTouched);
    const e = validate(fields);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      if (e.title)            titleRef.current?.focus();
      else if (e.description) descRef.current?.focus();
      else if (e.price)       priceRef.current?.focus();
      else if (e.category)    categoryRef.current?.focus();
      return;
    }
    onSubmit({ ...fields, price: Number(fields.price) });
  };

  const inputCls = (key) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
      errors[key] && touched[key]
        ? "border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-200"
        : "border-gray-200 bg-gray-50 focus:border-[#0e9888] focus:ring-2 focus:ring-[#0e9888]/15 focus:bg-white"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#f0faf8] to-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#0e9888] rounded-xl flex items-center justify-center">
            {isEdit ? <Edit3 size={17} className="text-white" /> : <PlusCircle size={17} className="text-white" />}
          </div>
          <div>
            <h2 className="font-black text-gray-900 text-base">{isEdit ? "編輯課程資訊" : "建立新課程"}</h2>
            <p className="text-xs text-gray-400">{isEdit ? `正在編輯：${initial.title}` : "填寫課程基本資料"}</p>
          </div>
        </div>
        {/* <motion.button
          onClick={onCancel}
          whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.18 }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
        >
          <X size={18} />
        </motion.button> */}
      </div>

      {/* Fields */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-600 mb-1.5 block">課程名稱 <span className="text-rose-400">*</span></label>
          <input ref={titleRef} value={fields.title}
            onChange={e => set("title", e.target.value)} onBlur={() => blur("title")}
            placeholder="例：從零開始學習 React 前端開發" className={inputCls("title")} />
          {errors.title && touched.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-600 mb-1.5 block">課程介紹 <span className="text-rose-400">*</span></label>
          <textarea ref={descRef} value={fields.description}
            onChange={e => set("description", e.target.value)} onBlur={() => blur("description")}
            placeholder="詳細描述課程內容、學習目標與適合對象..." rows={4}
            className={`${inputCls("description")} resize-none`} />
          {errors.description && touched.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 mb-1.5 block">
            課程金額（NT$）<span className="text-rose-400">*</span>
            <span className="text-gray-400 font-normal ml-1">上限 9,999</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">$</span>
            <input ref={priceRef} type="number" min={0} max={200000} value={fields.price}
              onChange={e => set("price", e.target.value)} onBlur={() => blur("price")}
              placeholder="0" className={`${inputCls("price")} pl-8`} />
          </div>
          {errors.price && touched.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 mb-1.5 block">課程類別 <span className="text-rose-400">*</span></label>
          <div className="relative">
            <select ref={categoryRef} value={fields.category}
              onChange={e => set("category", e.target.value)} onBlur={() => blur("category")}
              className={`${inputCls("category")} appearance-none pr-10 cursor-pointer`}>
              <option value="">請選擇類別</option>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.category && touched.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-600 mb-2 block">課程狀態</label>
          {!isEdit ? (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 w-fit">
              <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                          <span className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                              <LockKeyhole size={14} />
                              未上架（預設）
                          </span>
              <span className="text-xs text-gray-400">— 建立後可在編輯中切換上架</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {["未上架", "上架"].map((s) => (
                <label key={s} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold select-none ${
                  fields.status === s
                    ? s === "上架" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-300 bg-gray-50 text-gray-600"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                }`}>
                  <input type="radio" name="status" value={s} checked={fields.status === s}
                    onChange={() => set("status", s)} className="sr-only" />
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    fields.status === s ? (s === "上架" ? "bg-emerald-500" : "bg-gray-400") : "bg-gray-200"
                  }`} />
                      {s === "上架"
                          ? (<span className="flex items-center gap-1"><BookOpenCheck size={14} />上架</span>)
                          : (<span className="flex items-center gap-1"><LockKeyhole size={14} />未上架</span>)
                      }
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex items-center justify-end gap-3 border-t border-gray-50 pt-5">
        {/* <motion.button onClick={onCancel} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
          取消
        </motion.button> */}
        <motion.button onClick={handleSubmit}
          whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(14,152,136,0.28)" }} whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0e9888] text-white rounded-xl font-bold text-sm shadow-sm disabled:opacity-60">
          {loading ? <><Loader2 size={15} className="animate-spin" /> 處理中...</> : <><Save size={15} /> {isEdit ? "儲存變更" : "建立課程"}</>}
        </motion.button>
      </div>
    </motion.div>
  );
};


const InstructorCourseCard = ({ course, index, onEdit, onDelete, onStatusChange }) => {
  const img          = CATEGORY_IMAGES[course.category] || CATEGORY_IMAGES["其他"];
  const studentCount = Array.isArray(course.students) ? course.students.length : (course.students || 0);
  const isPublished  = course.status === "上架";
  const [toggling, setToggling] = useState(false);

  const handleToggleStatus = async (e) => {
    e.stopPropagation();
    if (toggling) return;
    const nextStatus = isPublished ? "未上架" : "上架";
    setToggling(true);
    try {
      const res = await CourseService.updateCourse(course._id, {
        title: course.title, description: course.description, price: course.price,
        category: course.category, status: nextStatus, chapters: course.chapters || [],
      });
      onStatusChange(course._id, res.data?.updatedCourse || { ...course, status: nextStatus });
    } catch (err) {
      console.error("切換上架狀態失敗:", err);
    } finally {
      setToggling(false);
    }
  };

  return (
    <motion.div
      variants={fadeUp} custom={index}
      whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(14,152,136,0.12)" }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
    >
      <div className="relative overflow-hidden aspect-video">
        <img src={img} alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute top-3 left-3">
          <motion.button
            onClick={handleToggleStatus} disabled={toggling}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            title={isPublished ? "點擊切換為未上架" : "點擊切換為上架"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all shadow-sm
              ${isPublished ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}
              ${toggling ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
          >
            {toggling ? <Loader2 size={11} className="animate-spin" />
              : isPublished ? <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              : <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />}
            {toggling ? "更新中..." : isPublished ? "已上架" : "未上架"}
          </motion.button>
        </div>
        {course.category && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            {course.category}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 min-h-[2.5rem]">{course.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 min-h-[2rem]">{course.description}</p>
        <div className="grid grid-cols-3 gap-2 mb-3 bg-gray-50 rounded-xl p-2.5">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-800">{studentCount.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400">學生</div>
          </div>
          <div className="text-center border-x border-gray-200">
            <div className="text-sm font-bold text-[#0e9888]">NT${Number(course.price).toLocaleString()}</div>
            <div className="text-[10px] text-gray-400">售價</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-500">{course.chapters?.length || 0}</div>
            <div className="text-[10px] text-gray-400">章節</div>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-2 border-t border-gray-50 pt-3">
          <motion.button onClick={() => onEdit(course)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 text-xs rounded-xl font-medium hover:border-[#0e9888] hover:text-[#0e9888] transition-colors">
            <Edit3 size={13} /> 編輯
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 text-xs rounded-xl font-medium hover:border-blue-400 hover:text-blue-500 transition-colors">
            <Eye size={13} /> 預覽
          </motion.button>
          <motion.button onClick={() => onDelete(course)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="p-2 border border-gray-200 text-gray-400 rounded-xl hover:border-rose-400 hover:text-rose-400 transition-colors">
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// 我的課程Tab
const InstructorCoursesTab = ({ currentUser }) => {
  const [courses, setCourses]             = useState([]);
  const [loadingList, setLoadingList]     = useState(true);
  const [fetchError, setFetchError]       = useState("");
  const [editTarget, setEditTarget]       = useState(null);
  const [editError, setEditError]         = useState("");
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [deleteError, setDeleteError]     = useState("");
  const [formLoading, setFormLoading]     = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const formTopRef = useRef(null);

  useEffect(() => {
    const _id = currentUser?.user?._id;
    if (!_id) return;
    setLoadingList(true);
    CourseService.getInstructorCourses(_id)
      .then(res => { setCourses(res.data || []); setFetchError(""); })
      .catch(() => setFetchError("無法載入課程，請稍後再試"))
      .finally(() => setLoadingList(false));
  }, []);

  const handleEditSubmit = async (fields) => {
    setFormLoading(true); setEditError("");
    try {
      const res = await CourseService.updateCourse(editTarget._id, fields);
      const updated = res.data?.updatedCourse || { ...editTarget, ...fields };
      setCourses(prev => prev.map(c => c._id === editTarget._id ? updated : c));
      setEditTarget(null);
    } catch (err) {
      setEditError(err?.response?.data?.message || "儲存失敗，請確認資料格式後再試");
    } finally { setFormLoading(false); }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true); setDeleteError("");
    try {
      await CourseService.deleteCourse(deleteTarget._id);
      setCourses(prev => prev.filter(c => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err?.response?.data?.message || "刪除失敗，請稍後再試");
    } finally { setDeleteLoading(false); }
  };

  const handleStatusChange = (_id, updatedCourse) =>
    setCourses(prev => prev.map(c => c._id === _id ? updatedCourse : c));

  const handleEditClick = (course) => {
    setEditTarget(course); setEditError("");
    setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  if (loadingList) return (
    <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
      <Loader2 size={22} className="animate-spin text-[#0e9888]" />
      <span className="text-sm">載入課程中...</span>
    </div>
  );

  if (fetchError) return (
    <div className="flex flex-col items-center py-20 gap-3 text-rose-400">
      <AlertTriangle size={28} />
      <span className="text-sm">{fetchError}</span>
    </div>
  );

  return (
    <div>
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal course={deleteTarget} onConfirm={handleDeleteConfirm}
            onCancel={() => { setDeleteTarget(null); setDeleteError(""); }}
            loading={deleteLoading} error={deleteError} />
        )}
      </AnimatePresence>

      <div ref={formTopRef} />
      <AnimatePresence>
        {editTarget && (
          <div className="mb-6">
            <AnimatePresence>
              {editError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl px-5 py-4 mb-4 text-sm">
                  <AlertTriangle size={17} className="flex-shrink-0" />
                  {editError}
                  <button onClick={() => setEditError("")} className="ml-auto text-rose-400 hover:text-rose-600">
                    <X size={15} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <CourseForm initial={editTarget} onSubmit={handleEditSubmit}
              onCancel={() => { setEditTarget(null); setEditError(""); }} loading={formLoading} />
          </div>
        )}
      </AnimatePresence>

      {courses.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center py-20 gap-4 text-gray-400">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
            <FileText size={28} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold">尚未建立任何課程</p>
          <p className="text-xs">前往「建立新課程」開始建立你的第一堂課</p>
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c, i) => (
            <InstructorCourseCard key={c._id || c.id} course={c} index={i}
              onEdit={handleEditClick} onDelete={setDeleteTarget}
              onStatusChange={handleStatusChange} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

// 建立新課程Tab
const CreateCourseTab = ({ onCreated }) => {
  const [loading, setLoading]             = useState(false);
  const [success, setSuccess]             = useState(false);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [error, setError]                 = useState("");

  const handleSubmit = async (fields) => {
    setLoading(true); setError("");
    try {
      const res = await CourseService.postNewCourse(
        fields.title, fields.description, fields.price,
        fields.category, fields.status, fields.chapters
      );
      const saved = res.data?.savedCourse;
      setCreatedCourse(saved);
      setSuccess(true);
      if (onCreated) onCreated(saved);
    } catch (err) {
      setError(err?.response?.data?.message || "建立課程失敗，請稍後再試");
    } finally { setLoading(false); }
  };

  if (success && createdCourse) {
    const img = CATEGORY_IMAGES[createdCourse.category] || CATEGORY_IMAGES["其他"];
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 mb-6">
          <CheckCircle size={20} className="flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">課程建立成功！</p>
            <p className="text-xs text-emerald-600">你可以前往「我的課程」查看或繼續建立新課程</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-6">
          <div className="aspect-video overflow-hidden relative">
            <img src={img} alt={createdCourse.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3"><StatusBadge status={createdCourse.status} /></div>
            {createdCourse.category && (
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                {createdCourse.category}
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-black text-gray-900 mb-1">{createdCourse.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 mb-4">{createdCourse.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[#0e9888] font-bold text-lg">NT$ {Number(createdCourse.price).toLocaleString()}</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{createdCourse.category}</span>
            </div>
          </div>
        </motion.div>
        <motion.button onClick={() => { setSuccess(false); setCreatedCourse(null); setError(""); }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors">
          繼續建立新課程
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl px-5 py-4 mb-5 text-sm">
            <AlertTriangle size={18} className="flex-shrink-0" />
            {error}
            <button onClick={() => setError("")} className="ml-auto text-rose-400 hover:text-rose-600"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>
      <CourseForm onSubmit={handleSubmit} onCancel={() => setError("")} loading={loading} />
    </div>
  );
};

// 數據分析Tab
const AnalyticsTab = ({ courses = [] }) => {
  const totalStudents    = courses.reduce((acc, c) => acc + (Array.isArray(c.students) ? c.students.length : 0), 0);
  const publishedCourses = courses.filter(c => c.status === "上架");

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "總學生數",   value: totalStudents.toLocaleString(), icon: Users,      color: "bg-purple-100 text-purple-600" },
          { label: "已上架課程", value: publishedCourses.length,         icon: TrendingUp, color: "bg-emerald-100 text-emerald-600" },
          { label: "課程總數",   value: courses.length,                  icon: BookOpen,   color: "bg-blue-100 text-blue-600" },
          { label: "平均評分",   value: "—",                             icon: Star,       color: "bg-amber-100 text-amber-600" },
        ].map((s, i) => (
          <motion.div key={i} variants={fadeUp} custom={i}
            whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.08)" }}
            className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
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
    </motion.div>
  );
};

// 主元件
// Props:
// currentUser      — 登入中的用戶
// activeTab        — 目前 tab key（由父層管理）
// courses          — 已從父層 fetch 好的課程陣列（用於 analytics）
// onCourseCreated  — 建立課程後通知父層更新 count
const InstructorDashboard = ({ currentUser, activeTab, courses, onCourseCreated }) => {
  switch (activeTab) {
    case "courses":
      return <InstructorCoursesTab currentUser={currentUser} />;
    case "create":
      return <CreateCourseTab onCreated={onCourseCreated} />;
    case "analytics":
      return <AnalyticsTab courses={courses} />;
    default:
      return null;
  }
};

export default InstructorDashboard;