import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import styles from './Input.module.css';
import { Input } from './Input';

describe('Input', () => {
  it('renders label and connects it to the input', () => {
    render(<Input label="Логин" placeholder="Введите логин" />);

    const input = screen.getByLabelText('Логин');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('supports left and right icons', () => {
    render(
      <Input
        aria-label="Логин"
        leftIcon={<span data-testid="left-icon">@</span>}
        rightIcon={<span data-testid="right-icon">x</span>}
      />,
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('supports password type', () => {
    render(<Input label="Пароль" type="password" />);

    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'password');
  });

  it('supports required attribute without visual asterisk', () => {
    render(<Input label="Логин" required />);

    const input = screen.getByLabelText(/Логин/);

    expect(input).toBeRequired();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('applies full width class', () => {
    render(<Input aria-label="Поиск" fullWidth />);

    expect(screen.getByRole('textbox', { name: 'Поиск' }).parentElement?.parentElement).toHaveClass(
      styles.fullWidth,
    );
  });

  it('applies gray background class', () => {
    render(<Input label="Поле" background="gray" />);

    expect(screen.getByLabelText('Поле').parentElement?.parentElement).toHaveClass(styles.bgGray);
  });

  it('forwards value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input aria-label="Логин" onChange={handleChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Логин' }), 'test');

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders error message and sets invalid state', () => {
    render(<Input label="Логин" error="Неверный логин или пароль" />);

    const input = screen.getByLabelText('Логин');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Неверный логин или пароль')).toBeInTheDocument();
  });

  it('applies error styling with invalid prop without message', () => {
    render(<Input label="Логин" invalid />);

    const input = screen.getByLabelText('Логин');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.parentElement?.parentElement).toHaveClass(styles.error);
  });
});
