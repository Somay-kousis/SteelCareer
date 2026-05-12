'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RoleSelectorProps {
  onSelectRole: (role: 'seeker' | 'provider') => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        I am looking for...
      </p>

      <div className="grid grid-cols-1 gap-4">
        {/* Seeker Role */}
        <Card
          onClick={() => onSelectRole('seeker')}
          className="relative group cursor-pointer border-border/40 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-border/60 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-6 space-y-3">
            <h3 className="text-lg font-light tracking-tight">
              Career Guidance
            </h3>
            <p className="text-sm text-muted-foreground">
              I&apos;m a seeker looking for personalized career guidance and opportunities
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-accent pt-2">
              <span>→</span>
              <span>Start Onboarding</span>
            </div>
          </div>
        </Card>

        {/* Provider Role */}
        <Card
          onClick={() => onSelectRole('provider')}
          className="relative group cursor-pointer border-border/40 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-border/60 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-6 space-y-3">
            <h3 className="text-lg font-light tracking-tight">
              Hire & Partner
            </h3>
            <p className="text-sm text-muted-foreground">
              I&apos;m a hiring provider or company looking to recruit talent
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-accent pt-2">
              <span>→</span>
              <span>Set Up Account</span>
            </div>
          </div>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center pt-4">
        You can change your role type after account creation
      </p>
    </div>
  );
}
