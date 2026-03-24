import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DataTable } from './DataTable';
import type { DataTableColumnMeta } from './DataTable.types';

interface ProductRow {
  id: string;
  name: string;
  vendor: string;
  price: string;
}

const columns = [
  {
    accessorKey: 'name',
    header: 'Наименование',
  },
  {
    accessorKey: 'vendor',
    header: 'Вендор',
  },
  {
    accessorKey: 'price',
    header: 'Цена',
    meta: {
      align: 'right',
    } satisfies DataTableColumnMeta,
  },
];

const rows: ProductRow[] = [
  {
    id: '1',
    name: 'USB флешкарта 16GB',
    vendor: 'Samsung',
    price: '48 652,00',
  },
];

describe('DataTable', () => {
  it('renders headers and rows', () => {
    render(<DataTable data={rows} columns={columns} getRowId={(row) => row.id} />);

    expect(screen.getByText('Наименование')).toBeInTheDocument();
    expect(screen.getByText('Вендор')).toBeInTheDocument();
    expect(screen.getByText('USB флешкарта 16GB')).toBeInTheDocument();
    expect(screen.getByText('Samsung')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<DataTable data={[]} columns={columns} emptyText="Список пуст" />);

    expect(screen.getByText('Список пуст')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <DataTable
        data={rows}
        columns={columns}
        isLoading
        loadingText="Загружаем товары"
      />,
    );

    expect(
      screen.getByRole('progressbar', { name: 'Загружаем товары' }),
    ).toBeInTheDocument();
  });

  it('supports row selection when enabled', async () => {
    const user = userEvent.setup();

    render(
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        selection={{
          selectAllLabel: 'Выбрать все строки',
          getRowLabel: (row) => `Выбрать ${row.name}`,
        }}
      />,
    );

    await user.click(screen.getByText('USB флешкарта 16GB'));

    expect(screen.getByLabelText('Выбрать USB флешкарта 16GB')).toBeChecked();
  });
});
