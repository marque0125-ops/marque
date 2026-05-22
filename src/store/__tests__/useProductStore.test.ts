import { describe, it, expect, beforeEach } from 'vitest';
import { useProductStore } from '../useProductStore';
import { PRODUCTS, MOCK_CATEGORIES } from '../../data/mockData';

describe('useProductStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useProductStore.setState({
      products: PRODUCTS,
      categories: MOCK_CATEGORIES,
      wishlist: [],
      searchQuery: '',
      filterCategory: 'ALL',
      filterBrand: 'ALL',
      filterTerrain: 'ALL',
      filterScale: 'ALL',
      filterBuildType: 'ALL',
      priceRange: [0, 150000],
      sortBy: 'newest'
    });
  });

  it('should initialize with default mock data', () => {
    const state = useProductStore.getState();
    expect(state.products.length).toBeGreaterThan(0);
    expect(state.wishlist).toEqual([]);
    expect(state.filterCategory).toBe('ALL');
  });

  it('should set filters correctly', () => {
    const store = useProductStore.getState();
    
    store.setSearchQuery('traxxas');
    expect(useProductStore.getState().searchQuery).toBe('traxxas');

    store.setFilterBrand('ARRMA');
    expect(useProductStore.getState().filterBrand).toBe('ARRMA');

    store.setFilterCategory('off-road');
    expect(useProductStore.getState().filterCategory).toBe('off-road');
  });

  it('should reset filters to default values', () => {
    const store = useProductStore.getState();
    store.setSearchQuery('test');
    store.setFilterBrand('ARRMA');
    
    store.resetFilters();
    
    const resetState = useProductStore.getState();
    expect(resetState.searchQuery).toBe('');
    expect(resetState.filterBrand).toBe('ALL');
    expect(resetState.filterCategory).toBe('ALL');
  });

  it('should toggle wishlist items', () => {
    const store = useProductStore.getState();
    const productId = 'prod-1';
    
    // Add to wishlist
    store.toggleWishlist(productId);
    expect(useProductStore.getState().wishlist).toContain(productId);

    // Remove from wishlist
    useProductStore.getState().toggleWishlist(productId);
    expect(useProductStore.getState().wishlist).not.toContain(productId);
  });

  it('should add and delete products', () => {
    const newProduct = { ...PRODUCTS[0], id: 'new-prod-1', name: 'Test Car' };
    
    useProductStore.getState().addProduct(newProduct);
    expect(useProductStore.getState().products.some(p => p.id === 'new-prod-1')).toBe(true);

    useProductStore.getState().deleteProduct('new-prod-1');
    expect(useProductStore.getState().products.some(p => p.id === 'new-prod-1')).toBe(false);
  });
});
