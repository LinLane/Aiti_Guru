import type { ButtonProps } from './Button.types';

import { classNames } from '../../libs/classNames';
import styles from './Button.module.css';

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    radius = 'md',
    shape = 'default',
    fullWidth = false,
    isActive = false,
    isLoading = false,
    leftIcon,
    className,
    type = 'button',
    disabled = false,
    ...restProps
  } = props;
  const iconOnly = !children && Boolean(leftIcon);
  const isDisabled = disabled || isLoading;
  const mods = {
    [styles[variant]]: true,
    [styles[size]]: true,
    [styles.fullWidth]: fullWidth,
    [styles.square]: iconOnly || shape === 'square',
    [styles.active]: isActive,
    [styles.loading]: isLoading,
    [styles.radiusSm]: radius === 'sm',
    [styles.radiusLg]: radius === 'lg',
    [styles.radiusPill]: radius === 'pill',
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={classNames(styles.button, mods, [className])}
      {...restProps}
    >
      {leftIcon && (
        <span aria-hidden="true" className={styles.icon}>
          {leftIcon}
        </span>
      )}
      {children && <span className={styles.label}>{children}</span>}
    </button>
  );
}

export default Button;
