import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';

import { classNames } from '../../libs/classNames';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'pagination';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'square';

export type ButtonProps = {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
  isActive?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      shape = 'default',
      fullWidth = false,
      isActive = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      type = 'button',
      disabled = false,
      ...restProps
    },
    ref,
  ) => {
    const iconOnly = !children && Boolean(leftIcon || rightIcon);
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        data-variant={variant}
        data-size={size}
        data-shape={iconOnly || shape === 'square' ? 'square' : 'default'}
        data-full-width={fullWidth || undefined}
        data-active={isActive || undefined}
        data-loading={isLoading || undefined}
        className={classNames(styles.button, {}, [className])}
        {...restProps}
      >
        {leftIcon && (
          <span aria-hidden="true" className={styles.icon}>
            {leftIcon}
          </span>
        )}
        {children && <span className={styles.label}>{children}</span>}
        {rightIcon && (
          <span aria-hidden="true" className={styles.icon}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;