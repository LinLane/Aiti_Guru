import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta = {
  title: 'Shared/Button',
  component: Button,
  args: {
    variant: 'primary',
    size: 'md',
    radius: 'md',
  },
  argTypes: {
    radius: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'pill'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Войти',
    size: 'lg',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Обновить',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Добавить',
    leftIcon: <span aria-hidden="true">+</span>,
  },
};

export const Radius: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button radius="sm" variant="secondary">
        radius sm
      </Button>
      <Button radius="md" variant="secondary">
        radius md
      </Button>
      <Button radius="lg" variant="secondary">
        radius lg
      </Button>
      <Button radius="pill" variant="secondary">
        radius pill
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: {
    leftIcon: <span aria-hidden="true">+</span>,
    'aria-label': 'Добавить',
  },
};

export const Pagination: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="ghost" aria-label="Предыдущая страница">
        {'<'}
      </Button>
      <Button variant="pagination" isActive>
        1
      </Button>
      <Button variant="pagination">2</Button>
      <Button variant="pagination">3</Button>
      <Button variant="pagination">4</Button>
      <Button variant="pagination">5</Button>
      <Button variant="ghost" aria-label="Следующая страница">
        {'>'}
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Войти',
    disabled: true,
  },
};
export const Loading: Story = {
  args: {
    children: 'Загрузка',
    isLoading: true,
  },
};
