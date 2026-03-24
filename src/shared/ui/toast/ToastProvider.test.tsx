import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

function TestHarness() {
  const { showToast } = useToast();
  return (
    <button type="button" onClick={() => showToast({ variant: 'error', message: 'Ошибка входа' })}>
      Показать
    </button>
  );
}

describe('ToastProvider', () => {
  it('shows error toast with alert role', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestHarness />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Показать' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Ошибка входа');
  });

  it('dismisses toast on close click', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TestHarness />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Показать' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Закрыть уведомление' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
