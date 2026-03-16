import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// 解決 JSX Hoisting 崩潰的「Mock 寫法」
// 在 mock 內部動態 require('react') 並使用 createElement，徹底避開 Babel JSX 提升陷阱
jest.mock('swiper/react', () => {
  const React = require('react');
  return {
    Swiper: ({ children }) => React.createElement('div', { 'data-testid': 'swiper-mock' }, children),
    SwiperSlide: ({ children }) => React.createElement('div', { 'data-testid': 'swiper-slide-mock' }, children),
  };
});

// Mock 掉 swiper/modules (回傳 null function 即可)
jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  A11y: () => null,
  Autoplay: () => null,
}));

// Mock 掉 CSS 引入 (回傳空物件)
jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/navigation', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));

// 經過上面完整的 Mock 防護網後，現在可以安全地引入 HomeComponent
import HomeComponent from '../components/Home-component';

describe('HomeComponent', () => {
  
  it('renders HomeComponent containing Swiper securely', () => {
    render(
      <BrowserRouter>
        <HomeComponent />
      </BrowserRouter>
    );

    // 讓Swiper (mock)成功被渲染
    const swiperElements = screen.getAllByTestId('swiper-mock');
    expect(swiperElements.length).toBeGreaterThan(0);
  });

});