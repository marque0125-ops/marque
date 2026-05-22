import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../useAuthStore';

// Mock Supabase to prevent actual network requests during testing
vi.mock('../../utils/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      isAuthenticated: false,
      jwtToken: null,
      userEmail: '',
      address: {
        name: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        gstin: ''
      }
    });
  });

  it('should initialize with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.jwtToken).toBeNull();
  });

  it('should handle login and set user details', () => {
    const store = useAuthStore.getState();
    store.login('John Doe', '9876543210', 'john@example.com', 'test.token.jwt');
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.jwtToken).toBe('test.token.jwt');
    expect(state.address.name).toBe('John Doe');
    expect(state.address.phone).toBe('9876543210');
    expect(state.userEmail).toBe('john@example.com');
  });

  it('should update address fields', () => {
    const store = useAuthStore.getState();
    store.setAddress({
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    });
    
    const state = useAuthStore.getState();
    expect(state.address.city).toBe('Mumbai');
    expect(state.address.state).toBe('Maharashtra');
    expect(state.address.pincode).toBe('400001');
  });

  it('should clear state on logout', () => {
    const store = useAuthStore.getState();
    store.login('Test', '123', 'test@test.com', 'token');
    
    useAuthStore.getState().logout();
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.jwtToken).toBeNull();
    expect(state.userEmail).toBe('');
    expect(state.address.name).toBe('');
  });
});
