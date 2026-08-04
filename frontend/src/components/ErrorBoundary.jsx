import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
          <div className="max-w-md rounded-lg border border-border bg-surface p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-signal-rose-soft">
              <AlertTriangle className="h-8 w-8 text-signal-rose" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-ink">Something went wrong</h1>
            <p className="mb-4 text-sm text-ink-muted">
              {this.props.fallbackMessage || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-ink">Error details</summary>
                <pre className="mt-2 overflow-auto rounded bg-canvas p-2 text-xs text-ink-muted">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
