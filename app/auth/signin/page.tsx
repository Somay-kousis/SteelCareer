'use client';

import { SignInForm } from '@/components/auth/sign-in-form';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="space-y-8">
      {/* Logo / Branding */}
      <div className="text-center">
        <h1 className="text-2xl font-light tracking-tight">
          Steelcareer
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Premium guidance for international careers
        </p>
      </div>

      {/* Sign In Form */}
      <SignInForm />

      {/* Footer Links */}
      <div className="text-center text-sm text-muted-foreground space-y-3">
        <p>
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-foreground hover:text-accent transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
