import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button';
import { Dialog } from './Dialog';
import type { DialogProps } from './Dialog.types';

const meta = {
  title: 'Shared/Dialog',
  component: Dialog,
  args: {
    title: 'Добавить товар',
    description: 'Заполните данные нового товара и подтвердите создание.',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

function DialogStory(args: DialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Открыть диалог</Button>

      <Dialog
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => setIsOpen(false)}>Сохранить</Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Здесь может быть форма, подтверждение действия или произвольный
          контент.
        </p>
      </Dialog>
    </>
  );
}

export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => undefined,
  },
  render: (args) => <DialogStory {...args} />,
};
