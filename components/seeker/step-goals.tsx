'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateSeeker } from '@/lib/api';

interface StepGoalsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const goalOptions = [
  { id: 'new-role', label: 'Find a New Role', description: 'I&apos;m actively seeking employment' },
  { id: 'upskill', label: 'Upskill & Reskill', description: 'Develop new competencies' },
  { id: 'consulting', label: 'Consulting Work', description: 'Take on advisory or consulting projects' },
  { id: 'network', label: 'Build Network', description: 'Expand professional connections' },
  { id: 'relocation', label: 'Facilitate Relocation', description: 'Move to a new country' },
  { id: 'visa', label: 'Visa Sponsorship Support', description: 'Need help with visa procedures' },
];

export function StepGoals({ onNext, onPrevious }: StepGoalsProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [otherGoals, setOtherGoals] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {
await updateSeeker({
  target_roles: selectedGoals,
  goals_summary: otherGoals,
});
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save goals');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const isComplete = selectedGoals.length > 0;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-light tracking-tight">
          Your Career Goals
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select what matters most to you right now
        </p>
      </div>

      <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goalOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleGoal(option.id)}
                disabled={isLoading}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left group ${
                  selectedGoals.includes(option.id)
                    ? 'border-accent bg-accent/10'
                    : 'border-border/40 bg-card/20 hover:bg-card/40'
                } disabled:opacity-50`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      selectedGoals.includes(option.id)
                        ? 'border-accent bg-accent'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {selectedGoals.includes(option.id) && (
                      <span className="text-accent-foreground text-xs font-bold">✓</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-border/40">
            <label htmlFor="otherGoals" className="block text-sm font-medium">
              Anything else we should know?
            </label>

            <textarea
              id="otherGoals"
              placeholder="Tell us about any other goals or preferences..."
              value={otherGoals}
              onChange={(e) => setOtherGoals(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="w-full bg-input border border-border/40 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

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