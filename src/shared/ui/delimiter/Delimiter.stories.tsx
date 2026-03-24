import type { Meta, StoryObj } from '@storybook/react-vite';

import { Delimiter } from './Delimiter';

const meta = {
  title: 'Shared/Delimiter',
  component: Delimiter,
} satisfies Meta<typeof Delimiter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    layout: 'padded',
  },
};

export const WithText: Story = {
  args: {
    text: 'или',
  },
  parameters: {
    layout: 'padded',
  },
};
