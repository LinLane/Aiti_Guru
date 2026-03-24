export type ToastVariant = 'error' | 'success' | 'info';

export interface ShowToastOptions {
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
}

export interface ToastContextValue {
  showToast: (options: ShowToastOptions) => void;
}

export interface ToastItemProps {
  variant: ToastVariant;
  message: string;
  onDismiss: () => void;
}

export interface ToastRecord extends Required<Pick<ShowToastOptions, 'message' | 'variant'>> {
  id: string;
  durationMs: number;
}
