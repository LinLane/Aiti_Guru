import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/Button';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

function ToastPlayground(props: { variant: 'error' | 'success' | 'info'; message: string }) {
  const { showToast } = useToast();

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => showToast({ variant: props.variant, message: props.message })}
    >
      Показать toast
    </Button>
  );
}

const meta = {
  title: 'Shared/Toast',
  component: ToastPlayground,
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  args: {
    variant: 'error' as const,
    message: 'Неверный логин или пароль',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['error', 'success', 'info'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ToastPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    variant: 'error',
    message: 'Неверный логин или пароль',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    message: 'Сохранено',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    message: 'Проверьте почту',
  },
};
