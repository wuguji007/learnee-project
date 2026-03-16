import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeComponent from './Home-component';

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