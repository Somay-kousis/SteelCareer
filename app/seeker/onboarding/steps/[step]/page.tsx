'use client';

import { use } from 'react';
import { StepIdentity } from '@/components/seeker/step-identity';
import { StepWorkAuth } from '@/components/seeker/step-work-auth';
import { StepExperience } from '@/components/seeker/step-experience';
import { StepLocationSalary } from '@/components/seeker/step-location-salary';
import { StepSlotBooking } from '@/components/seeker/step-slot-booking';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

interface StepPageProps {
  params: Promise<{ step: string }>;
}

export default function StepPage({ params }: StepPageProps) {
  const { step } = use(params);
  const router = useRouter();
  const stepNumber = parseInt(step, 10);

  const handleNext = () => {
    if (stepNumber < 5) {
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
        return <StepIdentity key="step1" onNext={handleNext} />;
      case 2:
        return <StepWorkAuth key="step2" onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <StepExperience key="step3" onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <StepLocationSalary key="step4" onNext={handleNext} onPrevious={handlePrevious} />;
      case 5:
        return <StepSlotBooking key="step5" onPrevious={handlePrevious} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative z-10 w-full max-w-2xl px-4 py-8 pb-8 md:px-0 md:py-12 md:pb-12">
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
}
