import type { HTMLAttributes, ReactNode } from 'react';

export interface DialogProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}
