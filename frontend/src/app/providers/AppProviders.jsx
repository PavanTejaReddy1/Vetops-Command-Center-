import { ThemeProvider } from './ThemeProvider';

/**
 * Single composition point for every app-wide provider (theme now;
 * query client, auth context, etc. in later phases). Wrap new global
 * providers here rather than in main.jsx so App stays a plain import.
 */
export function AppProviders({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
