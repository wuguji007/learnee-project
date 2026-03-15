import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, Briefcase, AlertCircle, 
  UserPlus, LogIn, Sparkles 
} from 'lucide-react';
import AuthService from "../services/auth.service";


// 共用錯誤訊息處理函式 (攔截 HTML，轉換為友善提示)
const extractErrorMessage = (error, defaultMessage) => {
  if (!error.response) return defaultMessage;
  
  const { data, status } = error.response;

  // 1. 如果後端回傳的是 HTML 結構 (例如伺服器預設的錯誤頁面)
  if (typeof data === 'string' && (data.includes('<html') || data.includes('<!DOCTYPE'))) {
    switch(status) {
      case 401: return "登入失敗：電子信箱或密碼錯誤。";
      case 400: return "資料格式錯誤，請確認欄位是否填寫正確。";
      case 403: return "您沒有權限執行此操作。";
      case 404: return "找不到指定的伺服器資源。";
      case 409: return "此信箱或帳號已經被註冊過了。";
      case 500: return "伺服器發生異常，請稍後再試。";
      default: return defaultMessage;
    }
  }

  // 2. 如果後端有定義 JSON 格式的錯誤訊息 (例如 { message: "密碼錯誤" })
  if (data && typeof data === 'object' && data.message) {
    return data.message;
  }

  // 3. 如果後端直接回傳純文字的錯誤訊息字串
  if (typeof data === 'string' && data.trim() !== '') {
    return data;
  }

  return defaultMessage;
};

// --- 共用動畫變數 ---
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const RegisterComponent = () => {
  const navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("student"); // 預設為 student，改善原本的手填
  let [message, setMessage] = useState("");
  let [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      await AuthService.register(username, email, password, role);
      window.alert("註冊成功。您現在將被導向到登入頁面");
      navigate("/login");
    } catch (e) {
      // 使用新的解析函式處理錯誤訊息
      const errorMsg = extractErrorMessage(e, "註冊失敗，請確認所有欄位是否填寫正確。");
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div className="min-h-screen bg-[#0e9888]/5 font-sans text-gray-900 relative flex items-center justify-center p-4 py-12">      
          
        {/* 網格背景 */}
        <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
            }}
        />

      <motion.div 
        initial="hidden" animate="visible" variants={staggerContainer}
        className="max-w-lg w-full relative z-10"
      >
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-gray-100">
          
          <motion.div variants={fadeUpVariants} className="text-center mb-8">
            <div className="w-16 h-16 bg-[#fec601]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#fec601]">
              <Sparkles size={32} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-[#021815] mb-2 inline-flex relative">
              <span className="relative z-10">加入我們</span>
              <span className="absolute z-0 bottom-1 left-0 w-full h-3 bg-[#fec601]/50 -z-10 rounded-sm"></span>
            </h2>
            <p className="text-gray-500 mt-2">開啟您的專屬學習或教學體驗</p>
          </motion.div>

          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-red-50 text-red-500 px-4 py-3 rounded-2xl flex items-center gap-2 mb-6 text-sm font-bold border border-red-100 overflow-hidden"
              >
                <AlertCircle size={18} className="shrink-0" />
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Role身份選擇 */}
            <motion.div variants={fadeUpVariants}>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">選擇您的身份</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`py-3 px-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${
                    role === "student" 
                    ? 'border-[#0e9888] bg-[#0e9888]/5 text-[#0e9888]' 
                    : 'border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  }`}
                >
                  <User size={20} /> 學生
                </button>
                <button
                  type="button"
                  onClick={() => setRole("instructor")}
                  className={`py-3 px-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${
                    role === "instructor" 
                    ? 'border-[#0e9888] bg-[#0e9888]/5 text-[#0e9888]' 
                    : 'border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  }`}
                >
                  <Briefcase size={20} /> 講師
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariants}>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">用戶名稱</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={20} />
                </div>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#0e9888]/50 focus:border-[#0e9888] transition-all outline-none text-gray-700 font-medium"
                  placeholder="您希望我們怎麼稱呼您？"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariants}>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">電子信箱</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#0e9888]/50 focus:border-[#0e9888] transition-all outline-none text-gray-700 font-medium"
                  placeholder="example@mail.com"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariants}>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">密碼</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#0e9888]/50 focus:border-[#0e9888] transition-all outline-none text-gray-700 font-medium"
                  placeholder="至少 6 個英文或數字"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariants} className="pt-2">
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0 12px 28px rgba(14,152,136,0.3)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0e9888] text-white font-bold py-4 rounded-2xl hover:bg-[#0b7a6d] transition-colors shadow-lg shadow-[#0e9888]/30 flex items-center justify-center gap-2"
              >
                {isLoading ? "處理中..." : "註冊會員"}
                {!isLoading && <UserPlus size={20} />}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={fadeUpVariants} className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              已經有帳號了嗎？ 
              <Link to="/login" className="text-[#0e9888] font-bold hover:underline ml-1">
                立即登入
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterComponent;
