'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

interface SignUpFormProps {
  role: 'seeker' | 'provider';
  onBack: () => void;
}

export function SignUpForm({ role, onBack }: SignUpFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const nameParts = fullName.trim().split(' ');
const firstName = nameParts[0] || '';
const lastName = nameParts.slice(1).join(' ') || '';
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName || '',
            last_name: lastName || '',
            role,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      console.log('[v0] Sign up successful:', data.user?.id);
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        if (role === 'seeker') {
          router.push('/seeker/onboarding/steps/1');
        } else {
          router.push('/provider/onboarding');
        }
      }, 1000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleLabel = role === 'seeker' ? 'Career Seeker' : 'Hiring Provider';

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-5">
      {/* Role Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-accent">
          Signing up as: {roleLabel}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Change
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 text-sm text-accent">
            Account created! Redirecting to {roleLabel.toLowerCase()} onboarding...
          </div>
        )}

        {/* Full Name Input */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-medium">
            Full Name
          </label>
          <Input
            id="fullName"
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading || success}
            required
            className="bg-input border-border/40 focus:ring-ring"
          />
        </div>

        {/* Email Input */}
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
            disabled={isLoading || success}
            required
            className="bg-input border-border/40 focus:ring-ring"
          />
        </div>

        {/* Password Input */}
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
            disabled={isLoading || success}
            required
            className="bg-input border-border/40 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            At least 8 characters
          </p>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading || success}
            required
            className="bg-input border-border/40 focus:ring-ring"
          />
        </div>

        {/* Sign Up Button */}
        <Button
          type="submit"
          disabled={isLoading || success}
          className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
        >
          {isLoading ? 'Creating account...' : success ? 'Account created!' : 'Create Account'}
        </Button>
      </form>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center">
        By signing up, you agree to our{' '}
        <a href="#" className="text-foreground hover:text-accent transition-colors">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-foreground hover:text-accent transition-colors">
          Privacy Policy
        </a>
      </p>
    </Card>
  );
}
