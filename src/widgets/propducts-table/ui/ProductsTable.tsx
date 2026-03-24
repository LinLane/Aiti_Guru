import { useEffect, useMemo, type ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import {
    PRODUCTS_PAGE_LIMIT,
    useProductsStore,
    type Product,
    type ProductsSortKey,
} from '../../../entities/products';
import { Button } from '../../../shared/ui/button';
import { DataTable } from '../../../shared/ui/data-table';
import styles from './ProductsTable.module.css';
import MoreIcon from "../assets/Vector.png";
import PlusIcon from "../assets/plus.png";

const priceFormatter = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function renderPrice(price: number) {
    const parts = priceFormatter.formatToParts(price);
    const fractionStartIndex = parts.findIndex((part) => part.type === 'decimal');

    if (fractionStartIndex === -1) {
        return <span>{priceFormatter.format(price)}</span>;
    }

    const mainValue = parts
        .slice(0, fractionStartIndex)
        .map((part) => part.value)
        .join('');
    const fractionValue = parts
        .slice(fractionStartIndex)
        .map((part) => part.value)
        .join('');

    return (
        <span className={styles.priceValue}>
            <span>{mainValue}</span>
            <span className={styles.priceFraction}>{fractionValue}</span>
        </span>
    );
}

function formatRatingValue(rating: number) {
    return rating.toFixed(1);
}


export default function ProductsTable() {
    const items = useProductsStore((state) => state.items);
    const isLoading = useProductsStore((state) => state.isLoading);
    const error = useProductsStore((state) => state.error);
    const page = useProductsStore((state) => state.page);
    const total = useProductsStore((state) => state.total);
    const sorting = useProductsStore((state) => state.sorting);
    const fetchProducts = useProductsStore((state) => state.fetchProducts);
    const setPage = useProductsStore((state) => state.setPage);
    const setSorting = useProductsStore((state) => state.setSorting);

    useEffect(() => {
        void fetchProducts();
    }, [fetchProducts]);

    const columns = useMemo<ColumnDef<Product, unknown>[]>(
        () => [
            {
                accessorKey: 'title',
                header: 'Наименование',
                cell: ({ row }): ReactNode => (
                    <div className={styles.productCell}>
                        {row.original.thumbnail.trim() ? (
                            <img
                                className={styles.thumbnail}
                                src={row.original.thumbnail}
                                alt=""
                                loading="lazy"
                                decoding="async"
                            />
                        ) : (
                            <div
                                className={styles.thumbnailPlaceholder}
                                aria-hidden
                            />
                        )}
                        <div className={styles.productContent}>
                            <span className={styles.productTitle}>{row.original.title}</span>
                            <span className={styles.productCategory}>
                                {row.original.category}
                            </span>
                        </div>
                    </div>
                ),
                meta: {
                    width: '30%',
                    sortable: true,
                    sortKey: 'title',
                    stickyStartOnMobile: true,
                    stickyStartOffset: '56px',
                    stickyStartLayer: 1,
                },
            },
            {
                accessorKey: 'brand',
                header: 'Вендор',
                cell: ({ row }): ReactNode => (
                    <span className={styles.vendorName}>{row.original.brand}</span>
                ),
            },
            {
                accessorKey: 'sku',
                header: 'Артикул',
                meta: {
                    cellLight: true,
                    minWidth: '200px',
                },
            },
            {
                accessorKey: 'rating',
                header: 'Оценка',
                cell: ({ row }) => {
                    const rating = row.original.rating;
                    const isLowRating = rating < 3.5;
                    return (
                        <span>
                            <span className={isLowRating ? styles.ratingDanger : undefined}>
                                {formatRatingValue(rating)}
                            </span>
                            /5
                        </span>
                    );
                },
                meta: {
                    align: 'center',
                    sortable: true,
                    sortKey: 'rating',
                    cellLight: true,
                },
            },
            {
                accessorKey: 'price',
                header: 'Цена, ₽',
                cell: ({ row }) => renderPrice(row.original.price),
                meta: {
                    align: 'center',
                    sortable: true,
                    sortKey: 'price',
                    cellLight: true,
                },
            },
            {
                id: 'actions',
                header: () => (
                    <span className={styles.visuallyHidden}>Действия</span>
                ),
                cell: (): ReactNode => (
                    <div className={styles.actionsCell}>
                        <div className={styles.addButton}>
                            <Button
                                variant="primary"
                                size="sm"
                                fullWidth
                                className={styles.iconButtonPrimary}
                                aria-label="Добавить товар"
                                leftIcon={<img src={PlusIcon} />}
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={styles.iconButtonSecondary}
                            aria-label="Действия с товаром"
                            leftIcon={<img src={MoreIcon} />}
                        />
                    </div>
                ),
                meta: {
                    align: 'center',
                    width: '312px',
                    cellClassName: styles.actionsColumn,
                    headerClassName: styles.actionsColumn,
                },
            },
        ],
        [],
    );

    async function handlePageChange(nextPage: number) {
        if (nextPage === page || nextPage < 0) {
            return;
        }

        await setPage(nextPage);
    }

    async function handleSortingChange(
        nextSorting: { sortBy: string; order: 'asc' | 'desc' } | null,
    ) {
        if (!nextSorting) {
            await setSorting(null);
            return;
        }

        await setSorting({
            sortBy: nextSorting.sortBy as ProductsSortKey,
            order: nextSorting.order,
        });
    }

    return (
        <div className={styles.root}>
            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            <DataTable
                className={styles.table}
                tableAriaLabel="Список товаров"
                data={items}
                columns={columns}
                isLoading={isLoading}
                loadingText="Загружаем товары..."
                emptyText="Товары не найдены"
                getRowId={(row) => String(row.id)}
                pagination={{
                    page,
                    total,
                    pageSize: PRODUCTS_PAGE_LIMIT,
                    onPageChange: (nextPage) => {
                        void handlePageChange(nextPage);
                    },
                    ariaLabel: 'Пагинация товаров',
                }}
                sorting={{
                    value: sorting,
                    onChange: (nextSorting) => {
                        void handleSortingChange(nextSorting);
                    },
                }}
                selection={{
                    selectAllLabel: 'Выбрать все товары',
                    getRowLabel: (row) => `Выбрать товар ${row.title}`,
                }}
            />
        </div>
    );
}