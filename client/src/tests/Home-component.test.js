import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeComponent from '../components/Home-component';

// 攔截並隱藏 React Router v7 的警告，讓控制台乾淨一點
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((msg) => {
    if (msg.includes('React Router Future Flag Warning')) return;
    console.warn(msg);
  });
});

describe('HomeComponent', () => {
  
  it('renders HomeComponent securely', () => {
    // 加上 try-catch 來捕捉並印出元件內部的實際錯誤
    try {
      // 在測試環境中，HomeComponent 可能需要一些預設的 props 或 currentUser 狀態
      // 如果你的元件依賴了 AuthContext 或 localStorage，你可能需要在這裡補上 Mock
      render(
        <BrowserRouter>
          <HomeComponent 
            currentUser={null} // 假設未登入狀態，這取決於你 HomeComponent 的設計
            setCurrentUser={() => {}} 
          />
        </BrowserRouter>
      );

      // 驗證我們的假 Swiper 是否有順利渲染
      const swiperElements = screen.getAllByTestId('swiper-mock');
      expect(swiperElements.length).toBeGreaterThan(0);
      
    } catch (error) {
      // 如果元件內部崩潰，這裡會印出真正的元兇！
      console.error('HomeComponent 內部發生渲染錯誤：', error);
      // 故意讓測試失敗，以顯示錯誤
      expect(error).toBeNull(); 
    }
  });

});