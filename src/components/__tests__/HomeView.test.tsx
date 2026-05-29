"use client";

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomeView from '../HomeView';
import { useUIStore } from '../../store/useUIStore';

// Mock matchMedia to prevent slick-carousel issues if any, though we use custom slider
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('HomeView', () => {
  beforeEach(() => {
    // Inject a dummy hero banner so the slider renders
    useUIStore.setState({
      heroBanners: [{
        id: 'hero-1',
        imageUrl: '/test.jpg',
        badgeText: 'Top Velocity',
        titleMain: '134+ KM/H',
        titleSub: 'Test Sub'
      }],
      promoBanners: [{
        id: 'promo-1',
        imageUrl: '/promo.jpg',
        badgeText: '',
        titleMain: '',
        titleSub: ''
      }]
    });
  });

  it('renders the hero and promo sliders', () => {
    render(<HomeView />);
    
    // Check if hero banner content is rendered
    expect(screen.getByText('134+ KM/H')).toBeInTheDocument();
    
    // Check if main sections are rendered
    expect(screen.getByText(/BRUTAL SPEED/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Track Rigs/i)).toBeInTheDocument();
  });

  it('renders product category tabs', () => {
    render(<HomeView />);
    
    expect(screen.getByText('Explore All Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Off-Road Bashers')).toBeInTheDocument();
  });
});
