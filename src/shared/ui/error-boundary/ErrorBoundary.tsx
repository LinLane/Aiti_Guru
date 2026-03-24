import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from '../button';
import styles from './ErrorBoundary.module.css';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary.types';

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
    console.error('[ErrorBoundary]', error, errorInfo.componentStack);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;

    if (error) {
      if (this.props.fallback) {
        return this.props.fallback(error, this.reset);
      }

      return <DefaultFallback error={error} />;
    }

    return this.props.children;
  }
}

function DefaultFallback({ error }: { error: Error }) {
  const isDev = import.meta.env.DEV;

  function handleReload(): void {
    window.location.reload();
  }

  return (
    <div className={styles.root} role="alert">
      <div className={styles.card}>
        <h1 className={styles.title}>Произошла ошибка</h1>
        <p className={styles.text}>Обновите страницу.</p>
        {isDev && (
          <pre className={styles.details}>{error.message}</pre>
        )}
        <div className={styles.actions}>
          <Button type="button" variant="primary" onClick={handleReload}>
            Обновить
          </Button>
        </div>
      </div>
    </div>
  );
}
