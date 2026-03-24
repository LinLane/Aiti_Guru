import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

import { classNames } from '../../libs/classNames';
import styles from './Dialog.module.css';
import type { DialogProps } from './Dialog.types';

export function Dialog(props: DialogProps) {
  const {
    isOpen,
    onClose,
    title,
    description,
    footer,
    children,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    showCloseButton = true,
    className,
    ...restProps
  } = props;

  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen || !closeOnEsc) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className={styles.overlay}
      role="presentation"
      onClick={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={classNames(styles.dialog, {}, [className])}
        {...restProps}
      >
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Закрыть"
              onClick={onClose}
            >
              <span className={styles.closeIcon} aria-hidden="true">
                ×
              </span>
            </button>
          )}
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export default Dialog;
