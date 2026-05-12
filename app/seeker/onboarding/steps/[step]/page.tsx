'use client';

import { use } from 'react';
import { StepBasicInfo } from '@/components/seeker/step-basic-info';
import { StepBackground } from '@/components/seeker/step-background';
import { StepGoals } from '@/components/seeker/step-goals';
import { StepLinks } from '@/components/seeker/step-links';
import { StepDocuments } from '@/components/seeker/step-documents';
import { StepSupport } from '@/components/seeker/step-support';
import { StepReview } from '@/components/seeker/step-review';
import { useRouter } from 'next/navigation';

interface StepPageProps {
  params: Promise<{ step: string }>;
}

export default function StepPage({ params }: StepPageProps) {
  const { step } = use(params);
  const router = useRouter();
  const stepNumber = parseInt(step, 10);

  const handleNext = () => {
    if (stepNumber < 7) {
      router.push(`/seeker/onboarding/steps/${stepNumber + 1}`);
    }
  };

  const handlePrevious = () => {
    if (stepNumber > 1) {
      router.push(`/seeker/onboarding/steps/${stepNumber - 1}`);
    }
  };

  const renderStep = () => {
    switch (stepNumber) {
      case 1:
        return <StepBasicInfo onNext={handleNext} />;
      case 2:
        return <StepBackground onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <StepGoals onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <StepLinks onNext={handleNext} onPrevious={handlePrevious} />;
      case 5:
        return <StepDocuments onNext={handleNext} onPrevious={handlePrevious} />;
      case 6:
        return <StepSupport onNext={handleNext} onPrevious={handlePrevious} />;
      case 7:
        return <StepReview onPrevious={handlePrevious} />;
      default:
        return null;
    }
  };

  return renderStep();
}
