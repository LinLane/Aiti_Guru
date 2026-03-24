import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'pagination';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'square';
export type ButtonRadius = 'sm' | 'md' | 'lg' | 'pill';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  shape?: ButtonShape;
  fullWidth?: boolean;
  isActive?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
}
