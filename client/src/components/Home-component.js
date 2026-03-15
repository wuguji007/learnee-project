import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Search, Bell, ShoppingCart, ChevronLeft, ChevronRight, 
  Star, Menu, PlayCircle, Users, Clock, 
  Monitor, Camera, Mic, Palette, BarChart, TrendingUp, Music, ArrowRight,
  Mail, Phone, MessageCircle, Plus, Flame, Award,UserStar
} from 'lucide-react';
// Swiper React
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- Mock Data ---

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    tag: "熱銷課程 🔥",
    title: "給大人的鋼琴入門課，一小時教你彈奏上手！",
    tagColor: "text-orange-500 bg-orange-100"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    tag: "新課上架 ✨",
    title: "React 前端開發實戰，從零打造響應式網頁！",
    tagColor: "text-blue-500 bg-blue-100"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1706586348467-5c1593cd0aad?q=80&w=2922&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tag: "限時優惠 🏷️",
    title: "五星主廚的居家料理，美味輕鬆上桌！",
    tagColor: "text-green-500 bg-green-100"
  }
];

const CROWDFUNDING_COURSES = [
  {
    id: 1,
    title: "創意寫作工坊：從靈感到出版的全過程",
    instructor: "Kelly Hsu",
    price: 2480,
    originalPrice: 3200,
    progress: 81,
    daysLeft: 10,
    participants: 521,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    title: "健康廚房：營養均衡的素食料理指南",
    instructor: "希姐帶你吃",
    price: 1680,
    originalPrice: 2080,
    progress: 281,
    daysLeft: 17,
    participants: 1397,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: 3,
    title: "音樂製作入門：從零開始創作你的音樂",
    instructor: "K.Dee",
    price: 2680,
    originalPrice: 3200,
    progress: 76,
    daysLeft: 9,
    participants: 420,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 4,
    title: "掌握商業攝影：打造你的專業攝影事業",
    instructor: "Mikeeee",
    price: 1980,
    originalPrice: 3200,
    progress: 98,
    daysLeft: 1,
    participants: 290,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/86.jpg"
  }
];

const BEST_SELLERS = [
  {
    id: 1,
    title: "創意寫作工坊：從靈感到出版的全過程",
    instructor: "Kelly Hsu",
    price: 2480,
    originalPrice: 3200,
    rating: 4.0,
    reviews: 333,
    students: 420,
    tags: ["中文創作"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    title: "小白也會！從零開始學習 Python 程式設計",
    instructor: "Kelly Hsu",
    price: 2480,
    originalPrice: 3200,
    rating: 4.0,
    reviews: 333,
    students: 420,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: 3,
    title: "全面掌握 JavaScript 開發技術",
    instructor: "Kelly Hsu",
    price: 2480,
    originalPrice: 3200,
    rating: 4.0,
    reviews: 333,
    students: 420,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg"
  },
  {
    id: 4,
    title: "HTML & CSS 網頁設計基礎教程",
    instructor: "Kelly Hsu",
    price: 2480,
    originalPrice: 3200,
    rating: 4.0,
    reviews: 333,
    students: 420,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 5,
    title: "影片剪輯實戰：用 Premiere Pro 打造專業影片",
    instructor: "Mikeeee",
    price: 1980,
    originalPrice: 2800,
    rating: 4.7,
    reviews: 512,
    students: 830,
    tags: ["拍攝剪輯"],
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/86.jpg"
  },
  {
    id: 6,
    title: "UI/UX 設計入門：打造令人愛不釋手的產品",
    instructor: "Anny Lin",
    price: 2880,
    originalPrice: 3600,
    rating: 4.9,
    reviews: 748,
    students: 1205,
    tags: ["藝術設計"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg"
  },
  {
    id: 7,
    title: "股票投資入門：散戶也能穩健獲利的策略",
    instructor: "財富導師 Warren",
    price: 1580,
    originalPrice: 2200,
    rating: 4.5,
    reviews: 290,
    students: 680,
    tags: ["投資理財"],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg"
  },
  {
    id: 8,
    title: "吉他從零開始：30 天學會你最愛的流行歌曲",
    instructor: "K. Lee",
    price: 1280,
    originalPrice: 1800,
    rating: 4.8,
    reviews: 923,
    students: 2100,
    tags: ["音樂創作"],
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  }
];

const INSTRUCTORS = [
  {
    id: 1,
    name: "Mr. Robert",
    role: "音樂創作",
    rating: 4.0,
    reviews: 333,
    desc: "Robert 的線上課程深受學生喜愛。他的教學方法生動有趣，能夠深入淺出地講解複雜的音樂理論，並結合實際演奏技巧，使學生能夠快速進步。",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Kelly Beck",
    role: "英文寫作",
    rating: 4.8,
    reviews: 281,
    desc: "Kelly 的教學方式靈活且富有創意，能夠有效提升學生的寫作技巧和自信心。Kelly 注重實用性，針對學生的需求量身打造教學內容，並提供具體的反饋和建議。",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "K. Lee",
    role: "音樂創作",
    rating: 4.8,
    reviews: 1245,
    desc: "K. Lee 的教學風格親切且耐心，能夠循序漸進地引導學生進入樂團的世界。學生們紛紛表示，K. Lee 的課程讓他們對音樂產生了濃厚的興趣！",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const CATEGORIES = [
  { icon: Monitor, label: "程式設計", count: "342 門課程", color: "bg-orange-100 text-orange-600" },
  { icon: Camera, label: "拍攝剪輯", count: "563 門課程", color: "bg-gray-800 text-white" },
  { icon: TrendingUp, label: "自我成長", count: "490 門課程", color: "bg-pink-100 text-pink-600" },
  { icon: Palette, label: "藝術設計", count: "230 門課程", color: "bg-purple-100 text-purple-600" },
  { icon: BarChart, label: "數據分析", count: "395 門課程", color: "bg-cyan-100 text-cyan-600" },
  { icon: Clock, label: "投資理財", count: "486 門課程", color: "bg-emerald-100 text-emerald-600" },
  { icon: Music, label: "音樂創作", count: "283 門課程", color: "bg-violet-100 text-violet-600" },
  { icon: ArrowRight, label: "探索更多", count: "", color: "bg-[#fec601] text-gray-800" },
];


// --- Shared animation variants ---
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};
 
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};
 
// Animated section wrapper — fades up when scrolled into view
function AnimatedSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
 
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}



export default function HomeComponent({setCartCount}) {
  
  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };
    
// --- Section元件 ---

const HeroCarousel = () => {
  const clonesCount = 2;
  const extendedSlides = [
    ...HERO_SLIDES.slice(-clonesCount),
    ...HERO_SLIDES,
    ...HERO_SLIDES.slice(0, clonesCount)
  ];

  const [slideWidthPercent, setSlideWidthPercent] = useState(80);

  useEffect(() => {
    const handleResize = () => {
      setSlideWidthPercent(window.innerWidth < 768 ? 100 : 80);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const centerOffsetPercent = (100 - slideWidthPercent) / 2;
  const [currentIndex, setCurrentIndex] = useState(clonesCount);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(() => handleNext(), 5000);
    return () => clearInterval(timer);
  }, [isDragging]);

  const handleNext = () => { setIsTransitioning(true); setCurrentIndex(p => p + 1); };
  const handlePrev = () => { setIsTransitioning(true); setCurrentIndex(p => p - 1); };

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (currentIndex < clonesCount) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + HERO_SLIDES.length);
    } else if (currentIndex >= clonesCount + HERO_SLIDES.length) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - HERO_SLIDES.length);
    }
  };

  const onDragStart = (e) => {
    setIsDragging(true);
    setIsTransitioning(false);
    const clientX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    setStartX(clientX);
  };

  const onDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    setDragOffset(clientX - startX);
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 100;
    if (dragOffset < -threshold) handleNext();
    else if (dragOffset > threshold) handlePrev();
    else setIsTransitioning(true);
    setDragOffset(0);
  };

  const realIndex = (currentIndex - clonesCount + HERO_SLIDES.length) % HERO_SLIDES.length;

  return (
    // Hero輪播
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative pt-6 pb-10 overflow-hidden select-none touch-pan-y"
    >
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-br from-[#0e9888]/10 to-transparent -z-10 rounded-br-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className="relative h-[400px] sm:h-[500px] group cursor-grab active:cursor-grabbing"
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
        >
          {/* Slider軌道 */}
          <div
            className={`flex h-full items-center ${isDragging ? '' : (isTransitioning ? 'transition-transform duration-500 ease-out' : '')}`}
            style={{ transform: `translateX(calc(-${currentIndex * slideWidthPercent}% + ${centerOffsetPercent}% + ${dragOffset}px))` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={index}
                  className="h-full relative flex-shrink-0"
                  style={{ width: `${slideWidthPercent}%` }}
                >
                  <div className={`w-full h-full rounded-[2.5rem] overflow-hidden shadow-xl relative transform ${
                    isTransitioning ? 'transition-all duration-500 ease-in-out' : ''
                  } ${isActive ? 'opacity-100 scale-100 ring-4 ring-white/40' : 'opacity-40 scale-90'}`}>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Slide content */}
                    <div className={`absolute bottom-10 left-4 sm:left-8 z-10 max-w-[85%] sm:max-w-lg flex flex-col items-start gap-4 ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                      <AnimatePresence mode="wait">
                        {/* 當前Active */}
                        {isActive && (
                          <motion.div
                            key={slide.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex flex-col items-start gap-4"
                          >
                            <div
                              className="px-4 py-2 inline-flex flex-col items-start gap-2"
                            >
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${slide.tagColor} whitespace-nowrap`}>{slide.tag}</span>
                              <h1 className='text-5xl text-white/95 font-bold text-shadow-3xl]'>{slide.title}</h1>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.04, y: -2, boxShadow: "0 12px 28px rgba(250, 255, 254, 0.15)" }}
                              whileTap={{ scale: 0.97 }}
                              transition={{ duration: 0.2 }}
                              className="ms-4 bg-[#0e9888] hover:bg-[#fec601] text-white text-sm sm:text-base font-bold py-3 px-6 rounded-3xl shadow-lg flex items-center justify-center gap-2"
                            >
                              探索感興趣的課程，今天立即上課
                              <ArrowRight size={18} />
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 左右導引按鈕 */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={handlePrev}
            className="hidden md:flex absolute left-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3bada0]/80 rounded-full items-center justify-center text-white text-bold shadow-lg hover:scale-110 transition-all z-20 cursor-pointer"
          >
            <ChevronLeft size={30} />
          </button>
          <button
             onMouseDown={(e) => e.stopPropagation()}
             onTouchStart={(e) => e.stopPropagation()}
            onClick={handleNext}
            className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3bada0]/80 rounded-full items-center justify-center text-white shadow-lg hover:scale-110 transition-all z-20 cursor-pointer"
          >
            <ChevronRight size={30} />
          </button>

          {/* Dots */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {HERO_SLIDES.map((_, index) => (
              <motion.button
                key={index}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={() => { setIsTransitioning(true); setCurrentIndex(index + clonesCount); }}
                animate={{
                  width: index === realIndex ? 32 : 8,
                  backgroundColor: index === realIndex ? '#fec601' : '#d1d5db'
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};  
  
  
const CrowdfundingSection = ({ onAddToCart }) => {
  const [activeFilter, setActiveFilter] = useState("全部");
  const filters = ["全部", "烹飪料理", "數據分析", "音樂創作", "創意寫作", "語言學習", "藝術設計"];
 
  return (
    <AnimatedSection  className="relative w-full py-16">
      {/* 網格背景+上下漸層消失 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      />

      {/* Main content */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-[#021815] mb-2 flex items-center">
                <span className='text-[#c5363a]'><Flame size={35} /></span>
                  <span className='relative z-10'>
                    火熱募資課程
                  {/* 螢光筆Underline */}
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[#fec601]/50 -z-10 rounded-sm"></span>
                </span>
              </h2>
              <p className="text-gray-500">選個感興趣的類別吧！</p>
            </motion.div>
  
            <div className="flex flex-wrap lg:flex-col gap-3 mb-8">
              {filters.map((filter, i) => (
                <motion.button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-6 py-4 ps-8 rounded-full text-sm font-bold transition-all text-left flex items-center gap-2
                    ${activeFilter === filter
                      ? 'bg-[#0e9888] text-white shadow-md'
                      : 'bg-white text-gray-500 border border-[#0e9888]/30 hover:bg-[#b0e6de]/50'
                    }`}
                >
                  <AnimatePresence>
                    {activeFilter === filter && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </AnimatePresence>
                  {filter}
                </motion.button>
              ))}
            </div>
  
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 12px 28px rgba(14,152,136,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[#0e9888] text-white font-bold py-4 rounded-xl hover:bg-[#0b7a6d] transition-colors shadow-lg shadow-[#0e9888]/30"
            >
              更多募資課程
            </motion.button>
          </div>
  
          {/* 四格卡片grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:w-3/4 grid md:grid-cols-2 gap-6"
          >
            {CROWDFUNDING_COURSES.map((course, i) => (
              <motion.div
                key={course.id}
                variants={fadeUpVariants}
                custom={i}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.07 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute top-4 left-4 text-[#f8ce35] text-xs [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] font-bold px-3 py-1 rounded-full border border-[#f8ce35]">
                    募資倒數 {course.daysLeft} 天
                  </div>
                </div>
  
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 min-h-[56px]">{course.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <img src={course.avatar} alt={course.instructor} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-gray-500">{course.instructor}</span>
                  </div>
  
                  {/* 進度條Animated */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-700 font-bold mb-1">
                      <span>募資進度 {course.progress}%</span>
                      <span className="text-gray-400 font-normal">已有 {course.participants} 位同學加入</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-[#fec601] h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(course.progress, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                      />
                    </div>
                  </div>
  
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-bold text-[#087b6c]">NT$ {course.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-400 line-through mb-1">NT$ {course.originalPrice.toLocaleString()}</span>
                    </div>
                    <motion.button
                      onClick={onAddToCart}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.93 }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#0e9888] text-white hover:bg-[#0e9888]/80 rounded-xl transition-colors font-semibold text-sm"
                    >
                      <ShoppingCart size={16} />
                      加入購物車
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>
      
    </AnimatedSection>
  );
};  

  
const BestSellerSection = ({ onAddToCart }) => {
  const swiperRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
 
  return (
    <div className="bg-[#0e9888]/5 py-16 overflow-hidden">
      {/* Swiper custom nav styles */}
      <style>{`
        .bestseller-swiper .swiper-slide {
          height: auto;
        }
        .bestseller-swiper .swiper-pagination {
          position: relative;
          margin-top: 28px;
        }
        .bestseller-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s;
        }
        .bestseller-swiper .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 4px;
          background: #fec601;
        }
      `}</style>
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={sectionRef}>
 
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#021815]">看看大家都買了什麼？</h2>
          <p className="text-gray-500 mt-2">熱銷課程一次看！</p>
        </AnimatedSection>
 
        {/* Section fades in when scrolled into view */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          {/* Nav引導按鈕 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute -left-4 md:-left-8 top-1/3 z-10 w-12 h-12 bg-white/90 hover:bg-[#cbe3e2]/60 rounded-full shadow-lg hidden md:flex items-center justify-center text-[#0e9888]"
          >
            <ChevronLeft size={25} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute -right-4 md:-right-8 top-1/3 z-10 w-12 h-12 bg-white/90 hover:bg-[#cbe3e2]/60 rounded-full shadow-lg hidden md:flex items-center justify-center text-[#0e9888]"
          >
            <ChevronRight size={25} />
          </motion.button>
 
          <Swiper
            className="bestseller-swiper"
            modules={[Navigation, Pagination, A11y]}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640:  { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {BEST_SELLERS.map((course, i) => (
              <SwiperSlide key={course.id} style={{ height: 'auto' }} className='py-6'>
                {/* Each card fades up with stagger via index */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: Math.min(i, 3) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(0,0,0,0.14)" }}
                  style={{ height: '100%' }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
                >
                  <div className="relative h-40 overflow-hidden">
                    <motion.img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute top-3 left-3 bg-[#fec601] text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <span>🔥</span> 限時 8 折
                    </div>
                  </div>
 
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 h-10">{course.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <img src={course.avatar} alt={course.instructor} className="w-5 h-5 rounded-full" />
                      <span className="text-xs text-gray-500">{course.instructor}</span>
                    </div>
 
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{course.tags[0]}</span>
                      <div className="flex items-center text-xs text-[#fec601] font-bold">
                        <Star size={12} fill="currentColor" />
                        <span className="ml-1">{course.rating}</span>
                        <span className="text-gray-300 ml-1 font-normal">({course.reviews})</span>
                      </div>
                    </div>
 
                    <div className="text-xs text-gray-400 mb-2">已有 {course.students.toLocaleString()} 同學加入</div>
 
                    <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
                      <div className="flex flex-col">
                        <div className="text-[#0e9888] font-bold">NT$ {course.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-300 line-through">NT$ {course.originalPrice.toLocaleString()}</div>
                      </div>
                      <motion.button
                        onClick={onAddToCart}
                        whileHover={{ scale: 1.12, backgroundColor: "#0b7a6d" }}
                        whileTap={{ scale: 0.88 }}
                        className="p-2 bg-[#0e9888] text-white rounded-lg shadow-sm"
                        title="加入購物車"
                      >
                        <ShoppingCart size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </div>
  );
}; 

  
const CategoriesSection = () => {
  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-[#23a495] rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden text-white shadow-2xl">
 
        <div className="absolute top-1/2 right-20 w-32 h-1 bg-white/20 rounded-full rotate-45"></div>
        <div className="absolute bottom-10 right-40 w-24 h-24 border-2 border-white/20 rounded-full"></div>
 
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
 
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
            {CATEGORIES.map((cat, idx) => (
              <motion.button
                key={idx}
                variants={fadeUpVariants}
                custom={idx}
                whileHover={{ y: -8, boxShadow: "0 16px 32px rgba(0,0,0,0.18)", scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="bg-white rounded-3xl p-4 flex flex-col items-start gap-3 shadow-sm"
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center`}
                >
                  <cat.icon size={20} />
                </motion.div>
                <div className="text-left">
                  <div className="text-gray-900 font-bold text-sm">{cat.label}</div>
                  {cat.count && <div className="text-gray-400 text-xs mt-0.5">{cat.count}</div>}
                </div>
              </motion.button>
            ))}
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-1/3 text-center lg:text-left"
          >
            <h2 className="text-4xl font-bold [text-shadow:1px_1px_4px_rgba(0,0,0,0.3)] mb-4 flex flex-col gap-2">
              <span>想學什麼嗎？</span>
              <span>一探究竟。</span>
            </h2>
            <div className="w-24 h-1 bg-white/30 rounded-full mx-auto lg:mx-0 mt-6"></div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

 
const InstructorsSection = () => {
  return (
    <AnimatedSection className="bg-white py-16 pb-32 relative">
      {/* 網格overlay */}
      <div
        className="absolute z-10 inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      />
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="relative mb-8">
          <h2 className="text-3xl font-bold text-[#021815] tracking-wide mb-2 flex justify-center">
            <span className='text-[#fec601] me-2'><Award size={35} /></span>
            <span className="relative">
              頂尖講師帶你飛
              {/* 螢光筆Underline */}
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#fec601]/50 -z-10 rounded-sm"></span>
            </span>
          </h2>
          <p className="text-gray-500">超真實學員評價，這些講師你絕對不能錯過！</p>
        </div>
 
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative z-10 grid md:grid-cols-3 gap-8"
        >
          {INSTRUCTORS.map((inst, i) => (
            <motion.div
              key={inst.id}
              variants={fadeUpVariants}
              custom={i}
              whileHover={{ y: -10, boxShadow: "0 28px 56px rgba(0,0,0,0.12)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-[#e6f5f2]/90 rounded-3xl p-6 flex flex-col items-center text-center relative z-50 pt-12 mt-12"
            >
              {/* Profile pic pops on hover */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="absolute -top-12 w-24 h-24 rounded-full p-1 bg-white shadow-md"
              >
                <img src={inst.image} alt={inst.name} className="w-full h-full object-cover rounded-full" />
              </motion.div>
 
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">{inst.name}</h3>
 
              <div className="flex items-center gap-3 mb-4 text-sm">
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-semibold">{inst.role}</span>
                <span className="flex items-center text-[#fec601] font-bold">
                  <Star size={14} fill="currentColor" className="mr-1" />
                  {inst.rating}
                  <span className="text-gray-400 font-normal ml-1">({inst.reviews})</span>
                </span>
              </div>
 
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-4">{inst.desc}</p>
 
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 28px rgba(14,152,136,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="mt-auto w-full py-4 mb-4 bg-[#0e9888] text-white text-sm font-semibold rounded-2xl hover:bg-[#0b7a6d] transition-colors"
              >
                探索 {inst.name} 的教學課程
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>
    </AnimatedSection>
  );
};
  
  
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
        {/* <Header cartCount={cartCount} /> */}
        <main>
            <HeroCarousel />
            <CrowdfundingSection onAddToCart={handleAddToCart} />
            <BestSellerSection onAddToCart={handleAddToCart} />
            <CategoriesSection />
            <InstructorsSection />
        </main>
        {/* <Footer /> */}
    </div>
  );
};
