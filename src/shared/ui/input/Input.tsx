import { useId, type InputHTMLAttributes } from 'react';

import { classNames } from '../../libs/classNames';
import styles from './Input.module.css';
import type { InputProps } from './Input.types';

export function Input(props: InputProps) {
  const {
    id,
    label,
    background = 'white',
    leftIcon,
    rightIcon,
    fullWidth = false,
    required = false,
    hint,
    error,
    invalid = false,
    reserveMessageSpace = false,
    className,
    type = 'text',
    disabled = false,
    ...restProps
  } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasErrorText = Boolean(error);
  const messageId = hasErrorText || hint ? `${inputId}-message` : undefined;
  const showErrorStyle = hasErrorText || invalid;
  const mods = {
    [styles.fullWidth]: fullWidth,
    [styles.bgGray]: background === 'gray',
    [styles.error]: showErrorStyle,
    [styles.disabled]: disabled,
  };

  const showMessageSlot = Boolean(hint || error || reserveMessageSpace);

  return (
    <div className={classNames(styles.root, mods, [className])}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={styles.control}>
        {leftIcon && (
          <span className={styles.icon} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={styles.input}
          aria-invalid={showErrorStyle || undefined}
          aria-describedby={messageId}
          {...(restProps as InputHTMLAttributes<HTMLInputElement>)}
        />
        {rightIcon && (
          <span className={styles.icon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {showMessageSlot && (
        <div
          id={messageId}
          className={classNames(styles.messageSlot, {
            [styles.messageSlotReserved]: reserveMessageSpace && !hint && !error,
          })}
        >
          {error ? (
            <span className={styles.message}>{error}</span>
          ) : hint ? (
            <span className={styles.hint}>{hint}</span>
          ) : reserveMessageSpace ? (
            <span aria-hidden="true">&nbsp;</span>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Input;
