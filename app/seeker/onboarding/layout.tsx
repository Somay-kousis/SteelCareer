'use client';

import { OnboardingSidebar } from '@/components/seeker/onboarding-sidebar';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/[0.05] via-transparent to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex w-72 border-r border-border/40 bg-card/20 backdrop-blur-sm sticky top-0 h-screen">
          <OnboardingSidebar />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
