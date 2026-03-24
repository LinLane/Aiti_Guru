import type { ColumnDef, TableOptions } from '@tanstack/react-table';

export type DataTableAlign = 'left' | 'center' | 'right';

export interface DataTableColumnMeta {
  align?: DataTableAlign;
  headerClassName?: string;
  cellClassName?: string;
  width?: string;
  minWidth?: string;
  sortable?: boolean;
  sortKey?: string;
  sortAccessibleName?: string;
  stickyStartOnMobile?: boolean;
  stickyStartOffset?: string;
  stickyStartLayer?: number;
  cellLight?: boolean;
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  emptyText?: string;
  loadingText?: string;
  isLoading?: boolean;
  className?: string;
  getRowId?: TableOptions<TData>['getRowId'];
  pagination?: DataTablePaginationProps;
  sorting?: DataTableSortingProps;
  selection?: DataTableSelectionProps<TData>;
  tableAriaLabel?: string;
}

export interface DataTablePaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
}

export interface DataTableSelectionProps<TData> {
  onChange?: (selectedRows: TData[]) => void;
  selectAllLabel?: string;
  getRowLabel?: (row: TData) => string;
}

export interface DataTableSortingValue {
  sortBy: string;
  order: 'asc' | 'desc';
}

export interface DataTableSortingProps {
  value: DataTableSortingValue | null;
  onChange: (sorting: DataTableSortingValue | null) => void;
}
