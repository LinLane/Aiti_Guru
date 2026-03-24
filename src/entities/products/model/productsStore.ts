import { create } from 'zustand';

import { apiClient, ApiError } from '../../../shared/api';

import type {
  Product,
  ProductsResponse,
  ProductsSorting,
  ProductsStore,
  ProductsStoreData,
} from './productsTypes';

export type {
  Product,
  ProductsResponse,
  ProductsSorting,
  ProductsSortKey,
  ProductsSortOrder,
  ProductsStore,
  ProductsStoreActions,
  ProductsStoreData,
} from './productsTypes';

export const PRODUCTS_PAGE_LIMIT = 20;
const SEARCH_PRODUCTS_DEBOUNCE_MS = 400;
const PRODUCTS_SORTING_STORAGE_KEY = 'products-sorting';

function readSortingFromStorage(): ProductsSorting | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(PRODUCTS_SORTING_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<ProductsSorting>;
    const sortBy = parsed.sortBy;
    const order = parsed.order;

    if (
      sortBy !== 'title' &&
      sortBy !== 'price' &&
      sortBy !== 'rating'
    ) {
      return null;
    }

    if (order !== 'asc' && order !== 'desc') {
      return null;
    }

    return { sortBy, order };
  } catch {
    return null;
  }
}

function writeSortingToStorage(sorting: ProductsSorting | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (sorting) {
    localStorage.setItem(
      PRODUCTS_SORTING_STORAGE_KEY,
      JSON.stringify(sorting),
    );
  } else {
    localStorage.removeItem(PRODUCTS_SORTING_STORAGE_KEY);
  }
}

export const productsInitialState: ProductsStoreData = {
  items: [],
  isLoading: false,
  error: null,
  page: 0,
  total: 0,
  skip: 0,
  searchQuery: '',
  sorting: null,
};

function getInitialStoreState(): ProductsStoreData {
  return {
    ...productsInitialState,
    sorting: readSortingFromStorage(),
  };
}

let currentProductsRequestId = 0;

export { SEARCH_PRODUCTS_DEBOUNCE_MS };

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.name === 'AbortError') {
    return '';
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Не удалось загрузить товары';
}

export const useProductsStore = create<ProductsStore>()((set, get) => ({
  ...getInitialStoreState(),

  fetchProducts: async (options) => {
    const requestId = ++currentProductsRequestId;

    set({
      isLoading: true,
      error: null,
    });

    try {
      const page = get().page;
      const skip = page * PRODUCTS_PAGE_LIMIT;
      const sorting = get().sorting;
      const searchQuery = get().searchQuery.trim();
      const searchParams = new URLSearchParams({
        limit: String(PRODUCTS_PAGE_LIMIT),
        skip: String(skip),
      });
      const requestPath = searchQuery ? '/products/search' : '/products';

      if (searchQuery) {
        searchParams.set('q', searchQuery);
      }

      if (sorting) {
        searchParams.set('sortBy', sorting.sortBy);
        searchParams.set('order', sorting.order);
      }

      const response = await apiClient.get<ProductsResponse>(
        `${requestPath}?${searchParams.toString()}`,
        { signal: options?.signal },
      );

      if (requestId !== currentProductsRequestId) {
        return;
      }

      set({
        items: response.products,
        total: response.total,
        skip: response.skip,
        isLoading: false,
      });
    } catch (error) {
      if (requestId !== currentProductsRequestId) {
        return;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        set({ isLoading: false });
        return;
      }

      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
    }
  },

  setPage: async (page) => {
    set({ page });
    await get().fetchProducts();
  },

  setSorting: async (sorting) => {
    writeSortingToStorage(sorting);

    set({
      sorting,
      page: 0,
      skip: 0,
    });

    await get().fetchProducts();
  },

  setSearchQuery: async (query, signal) => {
    set({
      searchQuery: query,
      page: 0,
      skip: 0,
    });

    await get().fetchProducts({ signal });
  },

  addProduct: (product: Product) => {
    set((state) => ({
      items: [product, ...state.items],
      total: state.total + 1,
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));
