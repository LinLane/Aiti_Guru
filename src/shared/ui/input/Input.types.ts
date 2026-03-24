import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputBackground = 'white' | 'gray';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  background?: InputBackground;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  reserveMessageSpace?: boolean;
}
