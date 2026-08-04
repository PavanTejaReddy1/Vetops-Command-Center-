import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './app/providers/AppProviders';
import { router } from './app/router';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}
