import type { Meta, StoryObj } from '@storybook/react-vite';

import { Link } from './Link';

const meta = {
  title: 'Shared/Link',
  component: Link,
  args: {
    children: 'Создать',
    href: '#',
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    layout: 'padded',
  },
};

export const WithoutUnderline: Story = {
  args: {
    underline: false,
  },
  parameters: {
    layout: 'padded',
  },
};
