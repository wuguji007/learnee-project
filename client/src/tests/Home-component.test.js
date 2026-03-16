import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import HomeComponent from '../components/Home-component';

describe('HomeComponent', () => {
  
  it('renders HomeComponent containing Swiper securely', () => {
    render(
      <BrowserRouter>
        <HomeComponent />
      </BrowserRouter>
    );

    const swiperElements = screen.getAllByTestId('swiper-mock');
    expect(swiperElements.length).toBeGreaterThan(0);
  });

});