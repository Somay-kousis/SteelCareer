'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateSeeker } from '@/lib/api';

interface StepBasicInfoProps {
  onNext: () => void;
}

export function StepBasicInfo({ onNext }: StepBasicInfoProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await updateSeeker({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      });
      console.log('[v0] Seeker basic info saved');
      onNext();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = firstName && lastName && email && phone;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-light tracking-tight">
          Let&apos;s get started
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Tell us your basic information so we can personalize your experience
        </p>
      </div>

      {/* Form Card */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                required
                className="bg-input border-border/40"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                required
                className="bg-input border-border/40"
              />
            </div>
          </div>

          {/* Email */}
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
              className="bg-input border-border/40"
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll use this to send you updates and opportunities
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              required
              className="bg-input border-border/40"
            />
            <p className="text-xs text-muted-foreground">
              International format preferred
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isComplete || isLoading}
            className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
          >
            {isLoading ? 'Saving...' : 'Continue to Next Step'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
