'use client';

import { OnboardingSidebar } from '@/components/seeker/onboarding-sidebar';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex w-80 border-r border-border/20 bg-background/40 backdrop-blur-md sticky top-0 h-screen">
          <OnboardingSidebar />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12">
          <div className="w-full max-w-3xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
