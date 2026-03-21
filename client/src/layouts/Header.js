import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, ShoppingCart, Menu,
  User, Bookmark, Settings, FileText,
  Edit3, LogOut, ChevronDown, X
} from 'lucide-react';
import AuthService from "../services/auth.service";


// Avatar helper縮寫頭像備援
const getInitials = (name = "") =>
  name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
 
const ROLE_LABEL = {
  student:    "學員",
  instructor: "認證講師",
};
 
// 下拉選單items
const STUDENT_MENU = [
  {
    group: "帳戶",
    items: [
      { icon: User,     label: "個人檔案", to: "/profile",  tab: "profile" },
      { icon: Bookmark, label: "我的收藏", to: "/profile",  tab: "bookmarks" },
      { icon: Settings, label: "帳號設定", to: "/settings" },
    ]
  },
  {
    group: "學習",
    items: [
      { icon: FileText, label: "訂單記錄",  to: "/orders" },
      { icon: Edit3,    label: "作業成果",  to: "/profile", tab: "portfolio" },
    ]
  },
];
 
const INSTRUCTOR_MENU = [
  {
    group: "帳戶",
    items: [
      { icon: User,     label: "個人檔案",  to: "/profile" },
      // { icon: Settings, label: "帳號設定",  to: "/settings" },
    ]
  },
  {
    group: "課程管理",
    items: [
      { icon: FileText, label: "我的課程",  to: "/profile", tab: "courses" },
      // { icon: Edit3,    label: "發佈課程",  to: "/postCourse" },
    ]
  },
];
 
// Dropdown動畫effects
const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0, y: -6, scale: 0.97,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};
 
const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: "easeOut" }
  })
};
 

function UserDropdown({ currentUser, setCurrentUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
 
  const user = currentUser?.user;
  const isInstructor = user?.role === "instructor";
  const menuGroups = isInstructor ? INSTRUCTOR_MENU : STUDENT_MENU;
  const roleLabel = ROLE_LABEL[user?.role] || "會員";
 
  // 外部點擊Close
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setOpen(false);
    navigate("/");
  };
 
  // 頭像使用randomuser portrait
  const avatarSrc = isInstructor
    ? "https://randomuser.me/api/portraits/women/44.jpg"
    : "https://randomuser.me/api/portraits/men/44.jpg";
 
  return (
    <div ref={ref} className="relative">
      {/* Avatar btn */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 rounded-full focus:outline-none group"
        aria-expanded={open}
      >
        {/* Avatar ring */}
        <div className={`relative w-9 h-9 rounded-full ring-2 transition-all duration-200 ${
          open ? "ring-[#0e9888] ring-offset-2" : "ring-gray-200 group-hover:ring-[#0e9888]/60"
        }`}>
          <img
            src={avatarSrc}
            alt={user?.username}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => { e.target.style.display = "none"; }}
          />

          <div className="absolute inset-0 flex items-center justify-center bg-[#0e9888] text-white text-xs font-bold rounded-full"
            style={{ display: "none" }}>
            {getInitials(user?.username)}
          </div>

          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
        </div>
 
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 hidden sm:block"
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.button>
 

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 bg-white mt-3 w-64 rounded-2xl overflow-hidden z-50"
            style={{
              transformOrigin: "top right",
            // Frosted glass core
            //   background: "rgba(255, 255, 255, 0.99)",
            //   backdropFilter: "blur(20px) saturate(180%)",
            //   WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.55)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >

            <div
              className="absolute inset-x-0 top-0 h-24 pointer-events-none"
              style={{
                // background: "linear-gradient(160deg, rgba(14,152,136,0.07) 0%, rgba(254,198,1,0.04) 100%)",
                borderRadius: "1rem 1rem 0 0",
              }}
            />
 
            {/* Menu groups */}
            <div className="py-2 relative">
              {menuGroups.map((group, gi) => (
                <div key={gi}>
                  {gi > 0 && (
                    <div
                      className="mx-3 my-1"
                      style={{ height: "1px", background: "rgba(0,0,0,0.06)" }}
                    />
                  )}
                  {group.items.map((item, ii) => {
                    const globalIndex = menuGroups
                      .slice(0, gi)
                      .reduce((acc, g) => acc + g.items.length, 0) + ii;
                    return (
                      <motion.div
                        key={ii}
                        custom={globalIndex}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          to={item.to}
                          state={item.tab ? { activeTab: item.tab } : undefined}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 rounded-xl mx-1 group/item transition-all duration-150"
                          style={{ "--hover-bg": "rgba(14,152,136,0.08)" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(14,152,136,0.08)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <span
                            className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-150 group-hover/item:text-[#0e9888]"
                            style={{ background: "rgba(0,0,0,0.05)" }}
                          >
                            <item.icon size={15} />
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
 
              {/* Divider + Logout */}
              <div
                className="mx-3 my-1"
                style={{ height: "1px", background: "rgba(0,0,0,0.06)" }}
              />
              <motion.div
                custom={menuGroups.reduce((acc, g) => acc + g.items.length, 0)}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 rounded-xl mx-1 group/logout transition-all duration-150"
                  style={{ width: "calc(100% - 8px)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(244,63,94,0.07)";
                    e.currentTarget.style.color = "#f43f5e";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "";
                  }}
                >
                  <span
                    className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-150"
                    style={{ background: "rgba(0,0,0,0.05)" }}
                  >
                    <LogOut size={15} />
                  </span>
                  <span className="font-medium">登出</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// 主元件
export default function Header({ cartCount, currentUser, setCurrentUser }) {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
 
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
 
  
    // 送出搜尋 --> 導向 /courses/search?q=關鍵字
    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (!q) return;
        navigate(`/courses/search?q=${encodeURIComponent(q)}`);
        setSearchQuery('');
    };  
  
  
    return ( 
        <header
            className="sticky top-0 z-50 border-b transition-all duration-500"
            style={scrolled ? {
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(18px) saturate(180%)",
            WebkitBackdropFilter: "blur(18px) saturate(180%)",
            borderColor: "rgba(255, 255, 255, 0.45)",
            boxShadow: "0 4px 24px rgba(14, 152, 136, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
            } : {
            background: "rgba(255, 255, 255, 1)",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            borderColor: "rgb(243, 244, 246)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",   
        }}
      >
      
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
 
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-6 flex-1">
          <Link to="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-[#0b9b8a] rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
              <span className="text-xl font-bold tracking-tight text-[#021815]">LEARNEE</span>
            </div>
          </Link>
 
          <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-md w-full ml-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm">探索</span>
                <span className="text-gray-300 mx-2">|</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                className="block w-full pl-16 pr-12 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0b9b8a] focus:shadow-lg sm:text-sm"
                placeholder="搜尋語言、投資、設計、料理及創作等各類課程"
              />
              <button type="submit" className="absolute inset-y-0 right-0 px-3 bg-[#0b9b8a] rounded-r-full text-white hover:bg-[#0b7a6d] transition-colors">
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
 
        {/* Right */}
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-[#0e9888] relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/2 -translate-y-1/2" />
          </button>
 
          <button className="text-gray-500 hover:text-[#0b9b8a] relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#fec601] text-[10px] text-gray-900 font-bold animate-bounce-short">
                {cartCount}
              </span>
            )}
          </button>
 
          {/* Logged in 顯示avatar dropdown */}
          {currentUser ? (
            <UserDropdown
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          ) : (
            /* Logged out 顯示登入/註冊 */
            <div className="flex gap-2">
              <button className="block px-4 py-2 border-[1.5px] border-[#0b9b8a]/60 text-[#0b9b8a] hover:text-white text-sm font-bold rounded-md hover:bg-[#0b9b8a] transition-colors shadow-md hover:shadow-lg">
                <Link to="/login">登入</Link>
              </button>
              <button className="block px-4 py-2 bg-[#0b9b8a] text-white text-sm font-bold rounded-md hover:bg-[#0b7a6d] transition-colors shadow-md hover:shadow-lg">
                <Link to="/register">註冊</Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

