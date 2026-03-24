import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Header,
} from '@tanstack/react-table';

import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { classNames } from '../../libs/classNames';
import SortIcon from './assets/sort.svg';
import styles from './DataTable.module.css';
import type {
  DataTableAlign,
  DataTableColumnMeta,
  DataTableProps,
  DataTableSortingValue,
} from './DataTable.types';

function shouldIgnoreRowClick(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'button, a, input, label, textarea, select, [role="button"], [data-row-selection-ignore="true"]',
    ),
  );
}

function getAlignClass(align?: DataTableAlign) {
  if (align === 'center') {
    return styles.alignCenter;
  }

  if (align === 'right') {
    return styles.alignRight;
  }

  return undefined;
}

function getColumnBoxStyle(meta?: DataTableColumnMeta): CSSProperties {
  return {
    ...(meta?.width ? { width: meta.width } : {}),
    ...(meta?.minWidth ? { minWidth: meta.minWidth } : {}),
  };
}

function getColgroupStyle(meta?: DataTableColumnMeta): CSSProperties {
  if (!meta?.width && !meta?.minWidth) {
    return {};
  }

  if (meta.width && meta.minWidth) {
    return { width: meta.width, minWidth: meta.minWidth };
  }

  if (meta.width) {
    return { width: meta.width };
  }

  return { minWidth: meta.minWidth };
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const pagesPerGroup = 5;
  const start = Math.floor(currentPage / pagesPerGroup) * pagesPerGroup;
  const end = Math.min(start + pagesPerGroup, totalPages);

  return Array.from({ length: end - start }, (_, index) => start + index);
}

function getNextSorting(
  currentSorting: DataTableSortingValue | null,
  sortKey: string,
) {
  if (!currentSorting || currentSorting.sortBy !== sortKey) {
    return {
      sortBy: sortKey,
      order: 'asc' as const,
    };
  }

  if (currentSorting.order === 'asc') {
    return {
      sortBy: sortKey,
      order: 'desc' as const,
    };
  }

  return null;
}

function getSortableColumnTitle<TData>(
  header: Header<TData, unknown>,
  meta?: DataTableColumnMeta,
): string {
  const rawHeader = header.column.columnDef.header;

  if (typeof rawHeader === 'string' && rawHeader.trim()) {
    return rawHeader;
  }

  return meta?.sortAccessibleName ?? 'Колонка';
}

function getSortButtonAriaLabel(
  columnTitle: string,
  isSorted: boolean,
  order: 'asc' | 'desc' | undefined,
): string {
  if (!isSorted || !order) {
    return `Сортировать по: ${columnTitle}`;
  }

  if (order === 'asc') {
    return `${columnTitle}, по возрастанию. Нажмите для сортировки по убыванию`;
  }

  return `${columnTitle}, по убыванию. Нажмите, чтобы сбросить сортировку`;
}

export function DataTable<TData>(props: DataTableProps<TData>) {
  const {
    data,
    columns,
    emptyText = 'Нет данных',
    loadingText = 'Загрузка...',
    isLoading = false,
    className,
    getRowId,
    pagination,
    sorting,
    selection,
    tableAriaLabel,
  } = props;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const isSelectable = Boolean(selection);

  const tableColumns = useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!selection) {
      return columns;
    }

    const selectionColumn: ColumnDef<TData, unknown> = {
      id: '__select__',
      header: ({ table }) => (
        <div data-row-selection-ignore="true">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onChange={(event) =>
              table.toggleAllPageRowsSelected(event.target.checked)
            }
            aria-label={selection.selectAllLabel ?? 'Выбрать все строки'}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div data-row-selection-ignore="true">
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(event) => row.toggleSelected(event.target.checked)}
            aria-label={
              selection.getRowLabel?.(row.original) ?? 'Выбрать строку таблицы'
            }
          />
        </div>
      ),
      meta: {
        width: '56px',
        align: 'center',
        headerClassName: styles.selectionHeadCell,
        cellClassName: styles.selectionCell,
        stickyStartOnMobile: true,
        stickyStartLayer: 0,
      },
      enableSorting: false,
      enableHiding: false,
    };

    return [selectionColumn, ...columns];
  }, [columns, selection]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: tableColumns,
    getRowId,
    enableRowSelection: isSelectable,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const leafColumns = table.getAllLeafColumns();
  const leafColumnsCount = leafColumns.length;
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;
  const visiblePages = pagination
    ? getVisiblePages(pagination.page, totalPages)
    : [];
  const startItem =
    pagination && pagination.total > 0
      ? pagination.page * pagination.pageSize + 1
      : 0;
  const endItem =
    pagination && pagination.total > 0
      ? Math.min(
          pagination.page * pagination.pageSize + data.length,
          pagination.total,
        )
      : 0;
  const isPrevDisabled = !pagination || pagination.page === 0;
  const isNextDisabled =
    !pagination ||
    totalPages === 0 ||
    pagination.page >= totalPages - 1;

  useEffect(() => {
    if (!selection?.onChange) {
      return;
    }

    const selectedRows = table.getSelectedRowModel().rows.map(
      (row) => row.original,
    );

    selection.onChange(selectedRows);
  }, [rowSelection, selection, table]);

  return (
    <div
      className={classNames(
        styles.wrapper,
        { [styles.wrapperLoading]: isLoading },
        [className],
      )}
    >
      <div className={styles.scroll}>
        <table
          className={styles.table}
          {...(tableAriaLabel ? { 'aria-label': tableAriaLabel } : {})}
        >
          <colgroup>
            {leafColumns.map((column) => {
              const meta = column.columnDef.meta as
                | DataTableColumnMeta
                | undefined;

              return (
                <col key={column.id} style={getColgroupStyle(meta)} />
              );
            })}
          </colgroup>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={styles.headRow}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | DataTableColumnMeta
                    | undefined;
                  const isSortable = Boolean(
                    sorting && meta?.sortable && meta?.sortKey,
                  );
                  const sortingState = isSortable ? sorting : undefined;
                  const isSorted =
                    isSortable && sortingState?.value?.sortBy === meta?.sortKey;
                  const sortOrder = isSorted
                    ? sortingState?.value?.order
                    : undefined;
                  const ariaSort = isSortable
                    ? isSorted && sortOrder
                      ? sortOrder === 'asc'
                        ? ('ascending' as const)
                        : ('descending' as const)
                      : ('none' as const)
                    : undefined;

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={classNames(
                        styles.headCell,
                        {
                          [getAlignClass(meta?.align) ?? '']: Boolean(meta?.align),
                          [styles.stickyStartOnMobile]: Boolean(
                            meta?.stickyStartOnMobile,
                          ),
                        },
                        [meta?.headerClassName],
                      )}
                      style={{
                        ...getColumnBoxStyle(meta),
                        ...(meta?.stickyStartOnMobile
                          ? {
                              left: meta.stickyStartOffset ?? '0',
                              ['--data-table-sticky-layer' as string]: String(
                                meta.stickyStartLayer ?? 0,
                              ),
                            }
                          : {}),
                      }}
                      {...(ariaSort ? { 'aria-sort': ariaSort } : {})}
                    >
                      {header.isPlaceholder ? null : (() => {
                        const content = flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        );

                        if (!isSortable || !meta?.sortKey || !sortingState) {
                          return content;
                        }

                        const sortKey = meta.sortKey;
                        const columnTitle = getSortableColumnTitle(header, meta);

                        return (
                          <button
                            type="button"
                            className={classNames(
                              styles.sortButton,
                              {
                                [styles.sortActive]: Boolean(isSorted),
                              },
                              [],
                            )}
                            aria-label={getSortButtonAriaLabel(
                              columnTitle,
                              Boolean(isSorted),
                              sortOrder,
                            )}
                            onClick={() =>
                              sortingState.onChange(
                                getNextSorting(sortingState.value, sortKey),
                              )
                            }
                          >
                            <span className={styles.sortLabel}>{content}</span>
                            <img
                              src={SortIcon}
                              alt=""
                              aria-hidden
                              className={classNames(
                                styles.sortIcon,
                                {
                                  [styles.sortAsc]: sortOrder === 'asc',
                                  [styles.sortDesc]: sortOrder === 'desc',
                                },
                                [],
                              )}
                            />
                          </button>
                        );
                      })()}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              <tr className={styles.loadingRow}>
                <td
                  colSpan={leafColumnsCount}
                  className={styles.loadingCell}
                  role="presentation"
                >
                  <div
                    className={styles.loadingCenter}
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                  >
                    <div
                      className={styles.indeterminateProgress}
                      role="progressbar"
                      aria-label={loadingText}
                    />
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={classNames(
                    styles.bodyRow,
                    {
                      [styles.selectableRow]: isSelectable,
                      [styles.selectedRow]: row.getIsSelected(),
                    },
                    [],
                  )}
                  aria-selected={isSelectable ? row.getIsSelected() : undefined}
                  onClick={
                    isSelectable
                      ? (event) => {
                          if (shouldIgnoreRowClick(event.target)) {
                            return;
                          }

                          row.toggleSelected();
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | DataTableColumnMeta
                      | undefined;

                    return (
                      <td
                        key={cell.id}
                        className={classNames(
                          styles.bodyCell,
                          {
                            [getAlignClass(meta?.align) ?? '']: Boolean(
                              meta?.align,
                            ),
                            [styles.stickyStartOnMobile]: Boolean(
                              meta?.stickyStartOnMobile,
                            ),
                            [styles.bodyCellLight]: Boolean(meta?.cellLight),
                          },
                          [meta?.cellClassName],
                        )}
                        style={{
                          ...getColumnBoxStyle(meta),
                          ...(meta?.stickyStartOnMobile
                            ? {
                                left: meta.stickyStartOffset ?? '0',
                                ['--data-table-sticky-layer' as string]: String(
                                  meta.stickyStartLayer ?? 0,
                                ),
                              }
                            : {}),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr className={styles.emptyRow}>
                <td colSpan={leafColumnsCount} className={styles.emptyCell}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <footer className={styles.footer}>
          <div className={styles.summary}>
            <p className={styles.summaryText}>
              <span className={styles.summaryMuted}>Показано </span>
              <span className={styles.summaryStrong}>
                {startItem}-{endItem}
              </span>
              <span className={styles.summaryMuted}> из </span>
              <span className={styles.summaryStrong}>{pagination.total}</span>
            </p>
          </div>

          {totalPages > 0 && (
            <nav
              className={styles.pager}
              aria-label={pagination.ariaLabel ?? 'Пагинация таблицы'}
            >
              <Button
                variant="pagination"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={isPrevDisabled}
                aria-label="Предыдущая страница"
              >
                {'<'}
              </Button>

              {visiblePages.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant="pagination"
                  size="sm"
                  isActive={pageNumber === pagination.page}
                  onClick={() => pagination.onPageChange(pageNumber)}
                  aria-current={pageNumber === pagination.page ? 'page' : undefined}
                >
                  {pageNumber + 1}
                </Button>
              ))}

              <Button
                variant="pagination"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={isNextDisabled}
                aria-label="Следующая страница"
              >
                {'>'}
              </Button>
            </nav>
          )}
        </footer>
      )}
    </div>
  );
}