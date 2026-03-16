// 共用常數：Mock Data、分類選項、封面圖對應、動畫 Variants

// 課程類別選項
export const CATEGORY_OPTIONS = [
  "程式設計",
  "拍攝剪輯",
  "自我成長",
  "藝術設計",
  "數據分析",
  "投資理財",
  "音樂創作",
  "烹飪料理",
  "創意寫作",
  "語言學習",
  "其他",
];

// 預設類別封面圖
export const CATEGORY_IMAGES = {
  "程式設計": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
  "拍攝剪輯": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
  "自我成長": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  "藝術設計": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  "數據分析": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "投資理財": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  "音樂創作": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
  "其他":     "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
};

// 學生 Mock 課程資料
export const STUDENT_COURSES = [
  {
    id: 2,
    title: "小白也會！從零開始學習 Python 程式設計",
    instructor: "Kelly Hsu",
    price: 2480, originalPrice: 3200,
    rating: 4.0, reviews: 333, students: 420,
    tags: ["程式開發"],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    progress: 68, status: "in_progress",
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
    progress: 20, status: "not_started",
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
    progress: 100, status: "completed",
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
    progress: 0, status: "not_started",
  },
];

// 學生 Mock 收藏資料
export const BOOKMARKED_COURSES = [
  {
    id: 6,
    title: "UI/UX 設計入門：打造令人愛不釋手的產品",
    instructor: "Anny Lin",
    price: 2880, originalPrice: 3600,
    rating: 4.9, reviews: 748, students: 1205,
    tags: ["藝術設計"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: 8,
    title: "吉他從零開始：30 天學會你最愛的流行歌曲",
    instructor: "K. Lee",
    price: 1280, originalPrice: 1800,
    rating: 4.8, reviews: 923, students: 2100,
    tags: ["音樂創作"],
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

// 錯開延遲動畫Variants
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};