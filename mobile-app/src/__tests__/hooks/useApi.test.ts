import { renderHook, act } from '@testing-library/react-native';
import { useApi, useApiMutation, useRealtimeSync } from '../../hooks/useApi';

// Mock del servicio de API
jest.mock('../../services/api', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('useApi Hook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useApi('/test'));
    
    expect(result.current[0].data).toBeNull();
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].error).toBeNull();
  });

  it('should handle successful API call', async () => {
    const mockData = { id: 1, name: 'Test' };
    const { result } = renderHook(() => useApi('/test'));
    
    await act(async () => {
      await result.current[1]();
    });
    
    expect(result.current[0].data).toEqual(mockData);
    expect(result.current[0].loading).toBe(false);
  });
});

describe('useApiMutation Hook', () => {
  it('should handle mutation operations', async () => {
    const mockMutation = jest.fn().mockResolvedValue({ data: { success: true } });
    const { result } = renderHook(() => useApiMutation(mockMutation));
    
    await act(async () => {
      await result.current[1]({ test: 'data' });
    });
    
    expect(result.current[0].data).toEqual({ success: true });
  });
});

describe('useRealtimeSync Hook', () => {
  it('should sync data at intervals', async () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useRealtimeSync('/test', 1000));
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current[0].loading).toBe(true);
    
    jest.useRealTimers();
  });
});