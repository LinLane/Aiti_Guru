export type ProductsSortKey = 'title' | 'price' | 'rating';
export type ProductsSortOrder = 'asc' | 'desc';

export interface ProductsSorting {
  sortBy: ProductsSortKey;
  order: ProductsSortOrder;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  brand: string;
  sku: string;
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsStoreData {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  page: number;
  total: number;
  skip: number;
  searchQuery: string;
  sorting: ProductsSorting | null;
}

export interface ProductsStoreActions {
  fetchProducts: (options?: { signal?: AbortSignal }) => Promise<void>;
  setPage: (page: number) => Promise<void>;
  setSorting: (sorting: ProductsSorting | null) => Promise<void>;
  setSearchQuery: (query: string, signal?: AbortSignal) => Promise<void>;
  addProduct: (product: Product) => void;
  clearError: () => void;
}

export type ProductsStore = ProductsStoreData & ProductsStoreActions;
