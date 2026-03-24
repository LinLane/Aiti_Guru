import styles from './Toast.module.css';
import type { ToastItemProps } from './types';

export function ToastItem(props: ToastItemProps) {
  const { variant, message, onDismiss } = props;

  const variantClass =
    variant === 'error' ? styles.error : variant === 'success' ? styles.success : styles.info;

  return (
    <div
      className={`${styles.toast} ${variantClass}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.dismiss}
        aria-label="Закрыть уведомление"
        onClick={onDismiss}
      >
        ×
      </button>
    </div>
  );
}
