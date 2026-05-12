'use client';

import { useState } from 'react';
import { RoleSelector } from '@/components/auth/role-selector';
import { SignUpForm } from '@/components/auth/sign-up-form';
import Link from 'next/link';

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'provider' | null>(null);

  return (
    <div className="space-y-8">
      {/* Logo / Branding */}
      <div className="text-center">
        <h1 className="text-2xl font-light tracking-tight">
          Steelcareer
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Join our community of career seekers and hiring partners
        </p>
      </div>

      {/* Role Selection or Form */}
      {selectedRole === null ? (
        <RoleSelector onSelectRole={setSelectedRole} />
      ) : (
        <>
          <SignUpForm role={selectedRole} onBack={() => setSelectedRole(null)} />
        </>
      )}

      {/* Footer Links */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-foreground hover:text-accent transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
