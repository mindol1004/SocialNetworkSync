import { useState, useCallback } from 'react';
import { AppError } from '@/shared/error/AppError';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: AppError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T, Args extends any[]>(
  apiFunc: (...args: Args) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await apiFunc(...args);
        setState({ data, isLoading: false, error: null });
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const apiError = error instanceof AppError 
          ? error 
          : new AppError(errorMessage, 500, 'UNKNOWN_ERROR');

        setState({ data: null, isLoading: false, error: apiError });
        return null;
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}