import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../useUIStore';

describe('useUIStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useUIStore.setState({
      heroBanners: [],
      promoBanners: [],
      lowStockAlerts: [],
      pincode: '',
      pinDetail: null,
      pinError: null,
    });
  });

  it('should initialize with default values', () => {
    const state = useUIStore.getState();
    expect(state.heroBanners).toEqual([]);
    expect(state.promoBanners).toEqual([]);
  });

  it('should add and remove hero banners', () => {
    const banner = { id: 'test-1', imageUrl: 'test.jpg', badgeText: 'New', titleMain: 'Test', titleSub: 'Sub' };
    
    useUIStore.getState().addHeroBanner(banner);
    expect(useUIStore.getState().heroBanners).toHaveLength(1);
    expect(useUIStore.getState().heroBanners[0]).toEqual(banner);

    useUIStore.getState().removeHeroBanner('test-1');
    expect(useUIStore.getState().heroBanners).toHaveLength(0);
  });

  it('should add and remove promo banners', () => {
    const banner = { id: 'promo-1', imageUrl: 'promo.jpg', badgeText: 'Sale', titleMain: 'Promo', titleSub: 'Sub' };
    
    useUIStore.getState().addPromoBanner(banner);
    expect(useUIStore.getState().promoBanners).toHaveLength(1);
    expect(useUIStore.getState().promoBanners[0]).toEqual(banner);

    useUIStore.getState().removePromoBanner('promo-1');
    expect(useUIStore.getState().promoBanners).toHaveLength(0);
  });

  it('should manage low stock alerts', () => {
    useUIStore.getState().addLowStockAlert('prod-1', 'Only 1 left!');
    expect(useUIStore.getState().lowStockAlerts).toHaveLength(1);
    expect(useUIStore.getState().lowStockAlerts[0].productId).toBe('prod-1');

    useUIStore.getState().clearLowStockAlerts();
    expect(useUIStore.getState().lowStockAlerts).toHaveLength(0);
  });
});
