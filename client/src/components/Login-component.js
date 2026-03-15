import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, Briefcase, ArrowRight, AlertCircle, 
  UserPlus, LogIn, Sparkles 
} from 'lucide-react';
import AuthService from "../services/auth.service";

// 共用錯誤訊息處理函式 (攔截 HTML，轉換為友善提示)
// ==========================================
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

// --- 共用動畫變數 (繼承自 Home-component) ---
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

const LoginComponent = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  let [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      let response = await AuthService.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("登入成功。您現在將被重新導向到個人資料頁面。");
      if (setCurrentUser) setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (e) {
      // 使用新的解析函式處理錯誤訊息
      const errorMsg = extractErrorMessage(e, "登入失敗，請檢查您的網路連線或稍後再試。");
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e9888]/5 font-sans text-gray-900 relative flex items-center justify-center p-4">
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
        className="max-w-md w-full relative z-10"
      >
        {/* 卡片本體 */}
        <motion.div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-gray-100">
          
          <motion.div variants={fadeUpVariants} className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0e9888]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0e9888]">
              <LogIn size={32} />
            </div>
            <h2 className="text-3xl font-bold text-[#021815] mb-2 inline-flex relative">
              <span className="relative z-10">歡迎回來</span>
              <span className="absolute z-0 bottom-1 left-0 w-full h-3 bg-[#fec601]/50 -z-10 rounded-sm"></span>
            </h2>
            <p className="text-gray-500 mt-2">請登入以繼續您的學習旅程</p>
          </motion.div>

          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-red-50 text-red-500 px-4 py-3 rounded-2xl flex items-start gap-2 mb-6 text-sm font-bold border border-red-100 overflow-hidden"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span className="leading-relaxed">{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="輸入您的密碼"
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
                {isLoading ? "登入中..." : "登入系統"}
                {!isLoading && <ArrowRight size={20} />}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={fadeUpVariants} className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              還沒有帳號嗎？ 
              <Link to="/register" className="text-[#0e9888] font-bold hover:underline ml-1">
                立即註冊
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginComponent;
