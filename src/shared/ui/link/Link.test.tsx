import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import styles from './Link.module.css';
import { Link } from './Link';

describe('Link', () => {
  it('renders anchor with children', () => {
    render(<Link href="/signup">Создать</Link>);

    const link = screen.getByRole('link', { name: 'Создать' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/signup');
  });

  it('applies underline class by default', () => {
    render(<Link href="/signup">Создать</Link>);

    expect(screen.getByRole('link', { name: 'Создать' })).toHaveClass(
      styles.link,
      styles.underline,
    );
  });

  it('supports links without underline', () => {
    render(
      <Link href="/signup" underline={false}>
        Создать
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Создать' })).toHaveClass(styles.link);
    expect(screen.getByRole('link', { name: 'Создать' })).not.toHaveClass(
      styles.underline,
    );
  });
});
