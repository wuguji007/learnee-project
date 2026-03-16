const React = require('react');

// 統一攔截所有來自 swiper 的元件、功能與 CSS 引入
module.exports = {
  // 模擬 swiper/react
  Swiper: ({ children }) => React.createElement('div', { 'data-testid': 'swiper-mock' }, children),
  SwiperSlide: ({ children }) => React.createElement('div', { 'data-testid': 'swiper-slide-mock' }, children),
  
  // 模擬 swiper/modules
  Navigation: () => null,
  Pagination: () => null,
  A11y: () => null,
  Autoplay: () => null,
  
  // 提供預設導出避免其他引入報錯
  default: () => null
};