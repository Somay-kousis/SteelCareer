'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user) {
        setError('User not found');
        return;
      }

      console.log('[auth] Sign in successful:', data.user.id);

      // Fetch real role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        setError('Failed to fetch user role');
        return;
      }

      const role = profile?.role || 'seeker';

      console.log('[auth] User role:', role);

      // Role-based redirect
      if (role === 'provider') {
        router.push('/provider/dashboard');
      } else if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/seeker/dashboard');
      }

    } catch (err) {
      console.error(err);

      const error = err as Error;

      setError(
        error.message || 'Failed to sign in. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="bg-input border-border/40 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            className="bg-input border-border/40 focus:ring-ring"
          />
        </div>

        <div className="text-right">
          <a
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/40" />
        </div>

        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-card/40 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full rounded-lg border-border/40 hover:bg-card/60"
        disabled={isLoading}
      >
        Google
      </Button>
    </Card>
  );
}