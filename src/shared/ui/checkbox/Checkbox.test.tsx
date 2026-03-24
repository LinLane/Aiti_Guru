import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders checkbox with label', () => {
    render(<Checkbox label="Запомнить данные" />);

    expect(screen.getByRole('checkbox', { name: 'Запомнить данные' })).toBeInTheDocument();
  });

  it('renders checkbox without label', () => {
    render(<Checkbox aria-label="Запомнить" />);

    expect(screen.getByRole('checkbox', { name: 'Запомнить' })).toBeInTheDocument();
  });

  it('supports checked state changes', async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Запомнить данные" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Запомнить данные' });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox aria-label="Запомнить" onChange={handleChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Запомнить' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Checkbox
        aria-label="Запомнить"
        disabled
        onChange={handleChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Запомнить' });

    expect(checkbox).toBeDisabled();

    await user.click(checkbox);

    expect(handleChange).not.toHaveBeenCalled();
  });
});
