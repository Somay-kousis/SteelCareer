'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function ProviderOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState<'type' | 'info'>('type');
  const [providerType, setProviderType] = useState<'recruiter' | 'company' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    hiringRegions: '',
    experience: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeSelect = (type: 'recruiter' | 'company') => {
    setProviderType(type);
    setStep('info');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsLoading(false);
    // Redirect to job posting
    router.push('/provider/job-posting');
  };

  if (step === 'type') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/[0.05] via-transparent to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-8 py-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-light tracking-tight">
              Welcome to Steelcareer
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Connect with pre-screened international talent
            </p>
          </div>

          {/* Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recruiter Card */}
            <Card
              onClick={() => handleTypeSelect('recruiter')}
              className="relative group cursor-pointer border-border/40 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-border/60 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 space-y-4">
                <div className="text-3xl">👤</div>
                <h3 className="text-xl font-light tracking-tight">
                  Recruiting Professional
                </h3>
                <p className="text-sm text-muted-foreground">
                  I&apos;m an independent recruiter or agency looking to source talent
                </p>
                <div className="flex items-center gap-2 text-sm text-accent font-medium pt-4">
                  <span>→</span>
                  <span>Continue</span>
                </div>
              </div>
            </Card>

            {/* Company Card */}
            <Card
              onClick={() => handleTypeSelect('company')}
              className="relative group cursor-pointer border-border/40 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-border/60 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 space-y-4">
                <div className="text-3xl">🏢</div>
                <h3 className="text-xl font-light tracking-tight">
                  Company / Organization
                </h3>
                <p className="text-sm text-muted-foreground">
                  I&apos;m hiring on behalf of a company
                </p>
                <div className="flex items-center gap-2 text-sm text-accent font-medium pt-4">
                  <span>→</span>
                  <span>Continue</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            You can change your provider type in settings later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-light tracking-tight">
              {providerType === 'recruiter'
                ? 'Set Up Your Recruiter Profile'
                : 'Set Up Your Company Profile'}
            </h1>
            <p className="text-muted-foreground">
              Tell us about yourself so seekers can learn about your opportunities
            </p>
          </div>

          {/* Form Card */}
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  {providerType === 'recruiter' ? 'Your Name' : 'Company Name'}
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder={providerType === 'recruiter' ? 'John Smith' : 'Acme Corp'}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-input border-border/40"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Contact Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-input border-border/40"
                />
              </div>

              {providerType === 'company' && (
                <>
                  {/* Company Website */}
                  <div className="space-y-2">
                    <label htmlFor="website" className="block text-sm font-medium">
                      Company Website
                    </label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={isLoading}
                      className="bg-input border-border/40"
                    />
                  </div>

                  {/* Hiring Regions */}
                  <div className="space-y-2">
                    <label htmlFor="hiringRegions" className="block text-sm font-medium">
                      Primary Hiring Regions
                    </label>
                    <Input
                      id="hiringRegions"
                      type="text"
                      placeholder="e.g., Asia, Europe, North America"
                      value={formData.hiringRegions}
                      onChange={(e) => handleInputChange('hiringRegions', e.target.value)}
                      disabled={isLoading}
                      className="bg-input border-border/40"
                    />
                  </div>
                </>
              )}

              {providerType === 'recruiter' && (
                <>
                  {/* Company / Agency */}
                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium">
                      Recruiting Agency / Company
                    </label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your agency name"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={isLoading}
                      className="bg-input border-border/40"
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label htmlFor="experience" className="block text-sm font-medium">
                      Years of Recruiting Experience
                    </label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="e.g., 8"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      disabled={isLoading}
                      min="0"
                      className="bg-input border-border/40"
                    />
                  </div>
                </>
              )}

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-muted-foreground">
                <p>✓ Complete setup is just {providerType === 'recruiter' ? '2' : '3'} steps. You can add job postings right after.</p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep('type');
                    setProviderType(null);
                  }}
                  disabled={isLoading}
                  className="flex-1 rounded-full border-border/40"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.name || !formData.email || isLoading}
                  className="flex-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isLoading ? 'Setting up...' : 'Next: Post a Job'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
