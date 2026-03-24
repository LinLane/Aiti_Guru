import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';
import styles from './Button.module.css';

describe('Button', () => {
  it('renders with button type by default', () => {
    render(<Button>Войти</Button>);

    const button = screen.getByRole('button', { name: 'Войти' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass(styles.button, styles.primary, styles.md);
  });

  it('renders icons and label together', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">+</span>}>
        Добавить
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('marks icon-only buttons as square', () => {
    render(<Button leftIcon={<span>+</span>} aria-label="Добавить" />);

    expect(screen.getByRole('button', { name: 'Добавить' })).toHaveClass(
      styles.square,
    );
  });

  it('sets loading state and blocks interaction', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button isLoading onClick={handleClick}>
        Сохранить
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Сохранить' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveClass(styles.loading);

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies small radius class', () => {
    render(<Button radius="sm">Маленький радиус</Button>);

    expect(screen.getByRole('button', { name: 'Маленький радиус' })).toHaveClass(
      styles.radiusSm,
    );
  });

  it('applies large radius class', () => {
    render(<Button radius="lg">Большой радиус</Button>);

    expect(screen.getByRole('button', { name: 'Большой радиус' })).toHaveClass(
      styles.radiusLg,
    );
  });

  it('supports active pagination state', () => {
    render(
      <Button variant="pagination" isActive>
        1
      </Button>,
    );

    expect(screen.getByRole('button', { name: '1' })).toHaveClass(
      styles.pagination,
      styles.active,
    );
  });

  it('forwards explicit button type', () => {
    render(<Button type="submit">Отправить</Button>);

    expect(screen.getByRole('button', { name: 'Отправить' })).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
