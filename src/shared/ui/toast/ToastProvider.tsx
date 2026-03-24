import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { ToastItem } from './ToastItem';
import styles from './Toast.module.css';
import { ToastContext } from './toast-context';
import type { ShowToastOptions, ToastRecord } from './types';

const DEFAULT_DURATION_MS = 6000;

export function ToastProvider(props: { children: ReactNode }) {
  const { children } = props;
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((previous) => previous.filter((item) => item.id !== id));
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      for (const timeoutId of timeouts.values()) {
        clearTimeout(timeoutId);
      }
      timeouts.clear();
    };
  }, []);

  const showToast = useCallback(
    (options: ShowToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const variant = options.variant ?? 'info';
      const durationMs = options.durationMs ?? DEFAULT_DURATION_MS;
      const record: ToastRecord = {
        id,
        variant,
        message: options.message,
        durationMs,
      };

      setToasts((previous) => [...previous, record]);

      if (durationMs > 0) {
        const timeoutId = setTimeout(() => dismiss(id), durationMs);
        timeoutsRef.current.set(id, timeoutId);
      }
    },
    [dismiss],
  );

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport} aria-label="Уведомления">
        {toasts.map((item) => (
          <ToastItem
            key={item.id}
            variant={item.variant}
            message={item.message}
            onDismiss={() => dismiss(item.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
