import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
  underline?: boolean;
}
