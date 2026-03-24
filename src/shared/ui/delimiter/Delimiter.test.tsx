import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import styles from './Delimiter.module.css';
import { Delimiter } from './Delimiter';

describe('Delimiter', () => {
  it('renders separator without text', () => {
    render(<Delimiter />);

    const separator = screen.getByRole('separator');

    expect(separator).toBeInTheDocument();
    expect(separator).not.toHaveClass(styles.withText);
  });

  it('renders centered text when provided', () => {
    render(<Delimiter text="или" />);

    expect(screen.getByText('или')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveClass(styles.withText);
  });

  it('forwards custom className', () => {
    render(<Delimiter className="custom-delimiter" text="или" />);

    expect(screen.getByRole('separator')).toHaveClass('custom-delimiter');
  });
});
