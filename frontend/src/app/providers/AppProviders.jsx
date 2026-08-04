import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';

/**
 * Single composition point for every app-wide provider (theme now;
 * query client, auth context, etc. in later phases). Wrap new global
 * providers here rather than in main.jsx so App stays a plain import.
 */
export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
