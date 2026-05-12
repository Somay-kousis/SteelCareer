'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StepSupportProps {
  onNext: () => void;
  onPrevious: () => void;
}

const supportOptions = [
  { id: 'resume-review', label: 'Resume Review & Optimization', description: 'Help perfecting my CV' },
  { id: 'interview-prep', label: 'Interview Preparation', description: 'Practice and coaching' },
  { id: 'salary-negotiation', label: 'Salary Negotiation Support', description: 'Guidance on compensation' },
  { id: 'visa-guidance', label: 'Visa & Immigration Guidance', description: 'Help with relocation documentation' },
  { id: 'career-coaching', label: 'Career Coaching', description: 'One-on-one strategic guidance' },
  { id: 'industry-intro', label: 'Industry Introductions', description: 'Connect with professionals in my field' },
  { id: 'language-support', label: 'Language Support', description: 'Help with English or other languages' },
  { id: 'networking', label: 'Networking Events', description: 'Community & professional events' },
];

export function StepSupport({ onNext, onPrevious }: StepSupportProps) {
  const [selectedSupport, setSelectedSupport] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsLoading(false);
    onNext();
  };

  const toggleSupport = (supportId: string) => {
    setSelectedSupport(prev =>
      prev.includes(supportId)
        ? prev.filter(id => id !== supportId)
        : [...prev, supportId]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-light tracking-tight">
          What Support Do You Need?
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select all areas where you&apos;d like assistance (optional)
        </p>
      </div>

      {/* Form Card */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Support Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {supportOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleSupport(option.id)}
                disabled={isLoading}
                className={`p-4 rounded-lg border transition-all duration-200 text-left group ${
                  selectedSupport.includes(option.id)
                    ? 'border-accent bg-accent/10'
                    : 'border-border/40 bg-card/20 hover:bg-card/40'
                } disabled:opacity-50`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      selectedSupport.includes(option.id)
                        ? 'border-accent bg-accent'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {selectedSupport.includes(option.id) && (
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

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-muted-foreground mt-6">
            <p>✨ <span className="text-foreground font-medium">Personalized approach:</span> You can adjust these preferences anytime in your dashboard.</p>
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
              disabled={isLoading}
              className="flex-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? 'Saving...' : 'Review & Submit'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
