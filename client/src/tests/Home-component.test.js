import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeComponent from '../components/Home-component';

// ==========================================
// 關鍵修復：補齊 Jest (JSDOM) 缺失的現代瀏覽器 API
// ==========================================

// 1. Mock framer-motion (useInView) 必須使用的 IntersectionObserver
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

// 2. Mock 某些 UI 套件或 CSS 媒體查詢會用到的 matchMedia
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

// 3. Mock window.scrollTo (避免切換頁面或動畫觸發滾動時報錯)
window.scrollTo = jest.fn();

// ==========================================

// 隱藏 React Router v7 的惱人警告
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((msg) => {
    if (msg?.includes('React Router Future Flag Warning')) return;
    console.warn(msg);
  });
});

describe('HomeComponent', () => {
  it('renders HomeComponent securely with Framer Motion', () => {
    // 預防萬一，提供一個基本的 user prop
    const mockUser = {
      user: { _id: 'test-id', username: 'testuser', role: 'student' }
    };

    // 因為我們已經解決了 Swiper 的 ESM 問題 (透過 moduleNameMapper)
    // 以及 framer-motion 的 API 問題 (透過上面的 Polyfill)
    // 這次渲染絕對不會再引發 AggregateError 了！
    render(
      <BrowserRouter>
        <HomeComponent currentUser={mockUser} setCurrentUser={() => {}} />
      </BrowserRouter>
    );

    // 只要元件沒有崩潰拋出錯誤，測試就算通過
    expect(true).toBe(true);
  });
});