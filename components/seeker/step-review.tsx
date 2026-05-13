'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface StepReviewProps {
  onPrevious: () => void;
}

export function StepReview({ onPrevious }: StepReviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setIsLoading(true);

    const response = await fetch('/api/seeker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        onboarding_completed_at: new Date().toISOString(),
        status: 'active',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to complete onboarding');
    }

    setIsSubmitted(true);

    setTimeout(() => {
      router.push('/seeker/dashboard');
    }, 1500);

  } catch (error) {
    console.error(error);
    alert('Failed to complete onboarding');
  } finally {
    setIsLoading(false);
  }
};

  if (isSubmitted) {
    return (
      <div className="space-y-8 text-center">
        <div className="space-y-3">
          <div className="text-6xl">🎉</div>
          <h1 className="text-4xl font-light tracking-tight">
            Welcome to Steelcareer!
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your profile is complete and we&apos;re matching you with opportunities
          </p>
        </div>

        <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-4">
          <p className="text-sm">
            You&apos;ll receive an email when opportunities are available. Our team is reviewing your information to personalize your experience.
          </p>
          <p className="text-xs text-muted-foreground">
            Redirecting to your dashboard...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-light tracking-tight">
          Review Your Profile
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Take a moment to review everything before submitting
        </p>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {/* Basic Info Summary */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-4">
          <h3 className="font-medium text-sm">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Name</p>
              <p className="font-light">John Doe</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Email</p>
              <p className="font-light">john@example.com</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs">Phone</p>
              <p className="font-light">+1 (555) 123-4567</p>
            </div>
          </div>
        </Card>

        {/* Professional Summary */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-4">
          <h3 className="font-medium text-sm">Professional Background</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Current Role</p>
              <p className="font-light">Senior Product Manager</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Experience</p>
              <p className="font-light">8 years</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Key Goals</p>
              <p className="font-light">New role, Visa sponsorship support</p>
            </div>
          </div>
        </Card>

        {/* Documents Summary */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-4">
          <h3 className="font-medium text-sm">Submitted Documents</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              <span className="font-light">Resume_John_Doe.pdf</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              <span className="font-light">Portfolio links</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Final Agreement */}
      <Card className="border-accent/40 bg-accent/5 backdrop-blur-sm p-6 space-y-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agreement"
            defaultChecked
            className="mt-1 w-4 h-4 rounded border-border/40 bg-input"
          />
          <label htmlFor="agreement" className="text-sm text-muted-foreground">
            I confirm that all information provided is accurate and complete. I understand that Steelcareer will review my profile and match me with opportunities.
          </label>
        </div>
      </Card>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading}
          className="flex-1 rounded-full border-border/40"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? 'Submitting...' : 'Submit & Complete'}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        You can edit your profile anytime after submission
      </p>
    </div>
  );
}
