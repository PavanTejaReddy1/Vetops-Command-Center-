import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas text-ink-faint">
        <Compass className="h-6 w-6" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
