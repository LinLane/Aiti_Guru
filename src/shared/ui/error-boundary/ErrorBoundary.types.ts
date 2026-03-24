import type { ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Заменить экран по умолчанию; второй аргумент — сброс состояния ошибки без перезагрузки страницы */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Дополнительно залогировать или отправить в аналитику */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  error: Error | null;
}
