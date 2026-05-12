'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StepBackgroundProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function StepBackground({ onNext, onPrevious }: StepBackgroundProps) {
  const [currentRole, setCurrentRole] = useState('');
  const [company, setCompany] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsLoading(false);
    onNext();
  };

  const isComplete = currentRole && company && yearsExperience && skills;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-light tracking-tight">
          Your Professional Background
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Help us understand your experience and expertise
        </p>
      </div>

      {/* Form Card */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Role */}
          <div className="space-y-2">
            <label htmlFor="currentRole" className="block text-sm font-medium">
              Current Job Title
            </label>
            <Input
              id="currentRole"
              type="text"
              placeholder="e.g., Senior Product Manager"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              disabled={isLoading}
              required
              className="bg-input border-border/40"
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label htmlFor="company" className="block text-sm font-medium">
              Current Company
            </label>
            <Input
              id="company"
              type="text"
              placeholder="e.g., Tech Corp"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={isLoading}
              required
              className="bg-input border-border/40"
            />
            <p className="text-xs text-muted-foreground">
              Or your most recent employer
            </p>
          </div>

          {/* Years of Experience */}
          <div className="space-y-2">
            <label htmlFor="yearsExperience" className="block text-sm font-medium">
              Years of Professional Experience
            </label>
            <Input
              id="yearsExperience"
              type="number"
              placeholder="e.g., 8"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              disabled={isLoading}
              required
              min="0"
              max="70"
              className="bg-input border-border/40"
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label htmlFor="skills" className="block text-sm font-medium">
              Key Skills
            </label>
            <textarea
              id="skills"
              placeholder="e.g., Product Strategy, Data Analysis, Team Leadership"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              disabled={isLoading}
              required
              rows={4}
              className="w-full bg-input border border-border/40 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list of your expertise areas
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
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
              type="submit"
              disabled={!isComplete || isLoading}
              className="flex-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? 'Saving...' : 'Next Step'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
