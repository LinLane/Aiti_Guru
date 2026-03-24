import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import ProductsTable from '../../../widgets/propducts-table';
import {
    AddProductDialog,
    type AddProductFormValues,
} from '../../../features/add-product';
import {
    SEARCH_PRODUCTS_DEBOUNCE_MS,
    useProductsStore,
    type Product,
} from '../../../entities/products';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { useToast } from '../../../shared/ui/toast';
import styles from './ProductsPage.module.css';
import RefreshIcon from "../assets/Refresh.png";
import PlusIcon from "../assets/PlusCircle.png";
import SearchIcon from "../assets/search.png";

function createProduct(values: AddProductFormValues): Product {
    const id = Date.now();

    return {
        id,
        title: values.title,
        category: '',
        price: values.price,
        rating: 0,
        brand: values.brand,
        sku: values.sku,
        thumbnail: '',
    };
}

export default function ProductsPage() {
    const { showToast } = useToast();
    const addProduct = useProductsStore((state) => state.addProduct);
    const fetchProducts = useProductsStore((state) => state.fetchProducts);
    const searchQuery = useProductsStore((state) => state.searchQuery);
    const setSearchQuery = useProductsStore((state) => state.setSearchQuery);
    const isLoading = useProductsStore((state) => state.isLoading);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [searchValue, setSearchValue] = useState(searchQuery);
    const isFirstSearchEffect = useRef(true);

    useEffect(() => {
        if (isFirstSearchEffect.current) {
            isFirstSearchEffect.current = false;
            return;
        }

        const abortController = new AbortController();
        const timeoutId = window.setTimeout(() => {
            void setSearchQuery(searchValue, abortController.signal);
        }, SEARCH_PRODUCTS_DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timeoutId);
            abortController.abort();
        };
    }, [searchValue, setSearchQuery]);

    function handleOpenAddDialog() {
        setIsAddDialogOpen(true);
    }

    function handleCloseAddDialog() {
        setIsAddDialogOpen(false);
    }

    function handleAddProduct(values: AddProductFormValues) {
        addProduct(createProduct(values));
        showToast({
            variant: 'success',
            message: 'Товар добавлен',
        });
    }

    function handleRefresh() {
        void fetchProducts();
    }

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearchValue(event.target.value);
    }

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Товары</h1>

                <div className={styles.search}>
                    <Input
                        fullWidth
                        value={searchValue}
                        placeholder="Найти"
                        leftIcon={<img src={SearchIcon} />}
                        aria-label="Поиск товаров"
                        background="gray"
                        onChange={handleSearchChange}
                    />
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Все позиции</h2>

                    <div className={styles.actions}>
                        <Button
                            variant="secondary"
                            size="md"
                            radius='sm'
                            leftIcon={<img src={RefreshIcon} />}
                            aria-label="Обновить товары"
                            onClick={handleRefresh}
                            disabled={isLoading}
                        />

                        <Button
                            variant="primary"
                            size="md"
                            radius='sm'
                            leftIcon={<img src={PlusIcon} />}
                            onClick={handleOpenAddDialog}
                        >
                            Добавить
                        </Button>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <ProductsTable />
                </div>

                <AddProductDialog
                    isOpen={isAddDialogOpen}
                    onClose={handleCloseAddDialog}
                    onSubmit={handleAddProduct}
                />
            </section>
        </main>
    );
}