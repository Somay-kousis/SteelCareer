'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const steps = [
  { id: 1, title: 'Identity', path: '/seeker/onboarding/steps/1' },
  { id: 2, title: 'Work Authorization', path: '/seeker/onboarding/steps/2' },
  { id: 3, title: 'Experience', path: '/seeker/onboarding/steps/3' },
  { id: 4, title: 'Location & Salary', path: '/seeker/onboarding/steps/4' },
  { id: 5, title: 'Screening Slot', path: '/seeker/onboarding/steps/5' },
];

export function OnboardingSidebar() {
  const pathname = usePathname();

  // Parse current step from pathname
  const currentStep = parseInt(pathname.split('/').pop() || '1', 10);
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="flex flex-col h-full p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-light tracking-tight">Onboarding</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Step {currentStep} of {steps.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Steps List */}
      <nav className="space-y-2 flex-1">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <Link
              key={step.id}
              href={step.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-card/60 border border-border/60 text-foreground'
                  : isCompleted
                  ? 'text-muted-foreground hover:bg-card/30'
                  : 'text-muted-foreground opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Step Number Circle */}
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-background'
                    : isCompleted
                    ? 'bg-accent/20 text-accent'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? '✓' : step.id}
              </div>

              {/* Step Title */}
              <span className="text-sm font-light">{step.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Help */}
      <div className="border-t border-border/40 pt-6 space-y-3">
        <p className="text-xs text-muted-foreground">
          Need assistance? We&apos;re here to help.
        </p>
        <button className="text-xs text-accent hover:text-accent/80 transition-colors font-medium">
          Contact Support
        </button>
      </div>
    </div>
  );
}
