import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { useAuthStore } from '../features/auth';
import AuthPage from '../pages/auth';
import ProductsPage from '../pages/products';
import { ToastProvider } from '../shared/ui/toast';
import styles from './App.module.css';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (isInitializing) {
    return (
      <p className={styles.loadingRoot} role="status" aria-live="polite">
        Загрузка…
      </p>
    );
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="auth" element={<AuthPage />} />
          <Route
            path="products"
            element={
              isAuthenticated ? <ProductsPage /> : <Navigate replace to="/auth" />
            }
          />
          <Route path="*" element={<Navigate replace to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App
