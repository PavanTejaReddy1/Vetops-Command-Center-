import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let result;
    if (isSignup) {
      result = await signup(email, password, firstName, lastName);
    } else {
      result = await login(email, password);
    }

    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <LoadingSkeleton variant="card" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            VetOps Command Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSignup ? 'Create your account' : 'Sign in to access your dashboard'}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="error" title={error} />
            )}

            {isSignup && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vetops.com"
                required
                autoComplete={isSignup ? "email" : "email"}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={6}
              />
              {isSignup && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting 
                ? (isSignup ? 'Creating account...' : 'Signing in...') 
                : (isSignup ? 'Sign Up' : 'Sign In')
              }
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
