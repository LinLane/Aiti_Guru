import { createRoot } from 'react-dom/client'

import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './app/styles/index.css'
import App from './app'
import { ErrorBoundary } from './shared/ui/error-boundary'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        void navigator.serviceWorker
            .register('/sw-images-cache.js')
            .catch(() => { });
    });
}

createRoot(document.getElementById('root')!).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>,
)
