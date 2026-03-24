import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 20C5.75 16.9 8.45 15 12 15C15.55 15 18.25 16.9 19 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="6" y="11" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9 11V8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8V11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const meta = {
  title: 'Shared/Input',
  component: Input,
  args: {
    label: 'Логин',
    placeholder: 'Введите логин',
    fullWidth: true,
    background: 'white',
  },
  argTypes: {
    background: {
      control: 'select',
      options: ['white', 'gray'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'test',
    readOnly: true,
    leftIcon: <UserIcon />,
    rightIcon: <ClearIcon />,
  },
  parameters: {
    layout: 'padded',
  },
};

export const Password: Story = {
  args: {
    label: 'Пароль',
    type: 'password',
    required: true,
    placeholder: 'Введите пароль',
    leftIcon: <LockIcon />,
  },
  parameters: {
    layout: 'padded',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Логин',
    value: 'test',
    readOnly: true,
    disabled: true,
    leftIcon: <UserIcon />,
    rightIcon: <ClearIcon />,
  },
  parameters: {
    layout: 'padded',
  },
};

export const Required: Story = {
  args: {
    label: 'Логин',
    required: true,
    placeholder: 'Введите логин',
    leftIcon: <UserIcon />,
  },
  parameters: {
    layout: 'padded',
  },
};

export const WithError: Story = {
  args: {
    label: 'Логин',
    value: 'wrong-user',
    readOnly: true,
    error: 'Неверный логин или пароль',
    leftIcon: <UserIcon />,
    rightIcon: <ClearIcon />,
  },
  parameters: {
    layout: 'padded',
  },
};

export const GrayBackground: Story = {
  args: {
    label: 'Поле на сером фоне',
    background: 'gray',
    placeholder: 'Введите значение',
    leftIcon: <UserIcon />,
  },
  parameters: {
    layout: 'padded',
  },
};
