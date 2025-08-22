import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, ApiResponse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface UseApiOptions {
  immediate?: boolean;
  cache?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T = any>(
  endpoint: string,
  options: UseApiOptions = {}
): [UseApiState<T>, () => Promise<void>] {
  const { immediate = true, cache = true, onSuccess, onError } = options;
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    if (!isAuthenticated) {
      setState(prev => ({ ...prev, error: 'No autenticado', loading: false }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Cancelar request anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const response = await apiService.get<T>(endpoint, cache);

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
        onSuccess?.(response.data);
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Error desconocido',
          success: false,
        });
        onError?.(response.error || 'Error desconocido');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request cancelado
      }

      setState({
        data: null,
        loading: false,
        error: 'Error de conexión',
        success: false,
      });
      onError?.('Error de conexión');
    }
  }, [endpoint, cache, isAuthenticated, onSuccess, onError]);

  useEffect(() => {
    if (immediate && isAuthenticated) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, isAuthenticated, execute]);

  return [state, execute];
}

export function useApiMutation<T = any, R = any>(
  mutationFn: (data: T) => Promise<ApiResponse<R>>,
  options: UseApiOptions = {}
): [UseApiState<R>, (data: T) => Promise<void>] {
  const { onSuccess, onError } = options;
  const [state, setState] = useState<UseApiState<R>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(async (data: T) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await mutationFn(data);

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
        onSuccess?.(response.data);
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Error desconocido',
          success: false,
        });
        onError?.(response.error || 'Error desconocido');
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: 'Error de conexión',
        success: false,
      });
      onError?.('Error de conexión');
    }
  }, [mutationFn, onSuccess, onError]);

  return [state, execute];
}

// Hooks específicos para entidades
export function useDrivers(params?: { status?: string; search?: string }) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return useApi(`/drivers${query}`);
}

export function useDriver(id: number) {
  return useApi(`/drivers/${id}`, { immediate: !!id });
}

export function useCreateDriver() {
  return useApiMutation((driverData: any) => apiService.createDriver(driverData));
}

export function useUpdateDriver() {
  return useApiMutation(({ id, data }: { id: number; data: any }) => 
    apiService.updateDriver(id, data)
  );
}

export function useDeleteDriver() {
  return useApiMutation((id: number) => apiService.deleteDriver(id));
}

export function useVehicles(params?: { status?: string; search?: string }) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return useApi(`/vehicles${query}`);
}

export function useVehicle(id: number) {
  return useApi(`/vehicles/${id}`, { immediate: !!id });
}

export function useCreateVehicle() {
  return useApiMutation((vehicleData: any) => apiService.createVehicle(vehicleData));
}

export function useUpdateVehicle() {
  return useApiMutation(({ id, data }: { id: number; data: any }) => 
    apiService.updateVehicle(id, data)
  );
}

export function useDeleteVehicle() {
  return useApiMutation((id: number) => apiService.deleteVehicle(id));
}

export function usePayments(params?: { status?: string; type?: string; search?: string }) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return useApi(`/payments${query}`);
}

export function usePayment(id: number) {
  return useApi(`/payments/${id}`, { immediate: !!id });
}

export function useCreatePayment() {
  return useApiMutation((paymentData: any) => apiService.createPayment(paymentData));
}

export function useUpdatePayment() {
  return useApiMutation(({ id, data }: { id: number; data: any }) => 
    apiService.updatePayment(id, data)
  );
}

export function useDeletePayment() {
  return useApiMutation((id: number) => apiService.deletePayment(id));
}

export function useContracts(params?: { status?: string; search?: string }) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return useApi(`/contracts${query}`);
}

export function useContract(id: number) {
  return useApi(`/contracts/${id}`, { immediate: !!id });
}

export function useCreateContract() {
  return useApiMutation((contractData: any) => apiService.createContract(contractData));
}

export function useUpdateContract() {
  return useApiMutation(({ id, data }: { id: number; data: any }) => 
    apiService.updateContract(id, data)
  );
}

export function useDeleteContract() {
  return useApiMutation((id: number) => apiService.deleteContract(id));
}

export function useExpenses(params?: { category?: string; status?: string; search?: string }) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return useApi(`/expenses${query}`);
}

export function useExpense(id: number) {
  return useApi(`/expenses/${id}`, { immediate: !!id });
}

export function useCreateExpense() {
  return useApiMutation((expenseData: any) => apiService.createExpense(expenseData));
}

export function useUpdateExpense() {
  return useApiMutation(({ id, data }: { id: number; data: any }) => 
    apiService.updateExpense(id, data)
  );
}

export function useDeleteExpense() {
  return useApiMutation((id: number) => apiService.deleteExpense(id));
}

export function useDashboard() {
  return useApi('/dashboard');
}

export function useStatuses(module?: string) {
  const query = module ? `?module=${module}` : '';
  return useApi(`/statuses${query}`);
}

// Hook para sincronización en tiempo real
export function useRealtimeSync<T>(
  endpoint: string,
  interval: number = 30000, // 30 segundos por defecto
  options: UseApiOptions = {}
) {
  const [state, execute] = useApi<T>(endpoint, { ...options, immediate: false });

  useEffect(() => {
    if (interval > 0) {
      const timer = setInterval(execute, interval);
      return () => clearInterval(timer);
    }
  }, [execute, interval]);

  return [state, execute];
}