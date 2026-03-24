import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('renders nothing when closed', () => {
    render(
      <Dialog isOpen={false} onClose={() => undefined} title="Добавить товар">
        Контент
      </Dialog>,
    );

    expect(
      screen.queryByRole('dialog', { name: 'Добавить товар' }),
    ).not.toBeInTheDocument();
  });

  it('renders title and content when open', () => {
    render(
      <Dialog isOpen onClose={() => undefined} title="Добавить товар">
        Контент диалога
      </Dialog>,
    );

    expect(
      screen.getByRole('dialog', { name: 'Добавить товар' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Контент диалога')).toBeInTheDocument();
  });

  it('closes on overlay click by default', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Dialog isOpen onClose={handleClose} title="Добавить товар">
        Контент
      </Dialog>,
    );

    await user.click(screen.getByRole('dialog').parentElement as HTMLElement);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes on escape when enabled', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Dialog isOpen onClose={handleClose} title="Добавить товар">
        Контент
      </Dialog>,
    );

    await user.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
