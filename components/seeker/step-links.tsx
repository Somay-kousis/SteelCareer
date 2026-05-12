'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StepLinksProps {
  onNext: () => void;
  onPrevious: () => void;
}

const linkTypes = [
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile' },
  { id: 'github', label: 'GitHub', placeholder: 'https://github.com/yourprofile' },
  { id: 'portfolio', label: 'Portfolio Website', placeholder: 'https://yourportfolio.com' },
  { id: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/yourhandle' },
  { id: 'other', label: 'Other Link', placeholder: 'https://example.com' },
];

export function StepLinks({ onNext, onPrevious }: StepLinksProps) {
  const [links, setLinks] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkChange = (id: string, value: string) => {
    setLinks(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsLoading(false);
    onNext();
  };

  const hasAtLeastOne = Object.values(links).some(link => link.trim());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-light tracking-tight">
          Online Presence
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Share your professional links and portfolios (optional)
        </p>
      </div>

      {/* Form Card */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {linkTypes.map((linkType) => (
            <div key={linkType.id} className="space-y-2">
              <label htmlFor={linkType.id} className="block text-sm font-medium">
                {linkType.label}
              </label>
              <Input
                id={linkType.id}
                type="url"
                placeholder={linkType.placeholder}
                value={links[linkType.id] || ''}
                onChange={(e) => handleLinkChange(linkType.id, e.target.value)}
                disabled={isLoading}
                className="bg-input border-border/40"
              />
            </div>
          ))}

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-muted-foreground mt-6">
            <p>💡 <span className="text-foreground font-medium">Tip:</span> The more details you provide, the better opportunities we can match for you.</p>
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
              {isLoading ? 'Saving...' : 'Next Step'}
            </Button>
          </div>
        </form>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        You can add or update these links later in your profile
      </p>
    </div>
  );
}
