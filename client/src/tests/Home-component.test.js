import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeComponent from '../components/Home-component';


// 1. 模擬 swiper/react 套件的元件
jest.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid="swiper-mock">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide-mock">{children}</div>,
}));

// 2. 模擬 swiper/modules 套件的功能
jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  A11y: () => null,
  Autoplay: () => null, // 如果你的輪播圖有用到 autoplay 也可以加上
}));

// CRA 預設會自動忽略 CSS import，所以 swiper/css 等引入不會造成報錯


describe('HomeComponent', () => {
  it('renders without crashing', () => {
    // 因為你的元件中很可能有使用到 <Link> 或 useNavigate，
    // 所以在測試時必須用 BrowserRouter 將元件包覆起來
    render(
      <BrowserRouter>
        <HomeComponent />
      </BrowserRouter>
    );

    // 這裡只做最簡單的渲染測試，確保元件不會拋出錯誤
    expect(true).toBe(true);

    // 進階寫法範例：測試畫面上有沒有特定的標題文字
    // 假設你的首頁有 "Learnee" 或是 "Welcome" 的字眼
    // const titleElement = screen.getByText(/Learnee/i);
    // expect(titleElement).toBeInTheDocument();
  });
});