import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeComponent from '../components/Home-component';


// ----- 補齊Jest(JSDOM)缺失的現代瀏覽器 API -----


// 1. Mock framer-motion useInView使用的IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// 2. Mock部分UI套件或CSS媒體查詢會用到的matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // 舊版 API
    removeListener: jest.fn(), // 舊版 API
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 3.Mock window.scrollTo (避免切換頁面或動畫觸發滾動時報錯)
window.scrollTo = jest.fn();


// 隱藏React Router v7的非關鍵警告
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((msg) => {
    if (msg?.includes('React Router Future Flag Warning')) return;
    console.warn(msg);
  });
});

describe('HomeComponent', () => {
  it('renders HomeComponent securely with Framer Motion', () => {
    // 預防用：提供一個基本的user prop
    const mockUser = {
      user: { _id: 'test-id', username: 'testuser', role: 'student' }
    };

    // 目前已解決：1.Swiper ESM 問題(透過 moduleNameMapper)
    // 2.framer-motion的API問題(透過Polyfill)
    // 避免AggregateError發生
    render(
      <BrowserRouter>
        <HomeComponent currentUser={mockUser} setCurrentUser={() => {}} />
      </BrowserRouter>
    );

    // if元件沒有崩潰拋出錯誤，測試PASS
    expect(true).toBe(true);
  });
});