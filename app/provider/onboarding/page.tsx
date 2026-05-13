'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { updateProvider } from '@/lib/api';

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
    companySize: '',
    description: '',
    linkedinUrl: '',
    contactPhone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTypeSelect = (type: 'recruiter' | 'company') => {
    setProviderType(type);
    setStep('info');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const splitList = (value: string) =>
    value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!providerType) {
      setError('Please select provider type');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await updateProvider({
        provider_type: providerType,
        company_name: providerType === 'company' ? formData.name : formData.company,
        company_website: formData.website || null,
        hiring_regions: splitList(formData.hiringRegions),
        description: formData.description || null,
        company_size: formData.companySize || null,
        contact_person_name: providerType === 'recruiter' ? formData.name : formData.name,
        contact_email: formData.email,
        contact_phone: formData.contactPhone || null,
        linkedin_url: formData.linkedinUrl || null,
      });

      router.push('/provider/job-posting');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save provider profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'type') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/[0.05] via-transparent to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-8 py-12">
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-light tracking-tight">
              Welcome to Steelcareer
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Connect with pre-screened international talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  I&apos;m an independent recruiter or agency looking to source talent.
                </p>
                <div className="flex items-center gap-2 text-sm text-accent font-medium pt-4">
                  <span>→</span>
                  <span>Continue</span>
                </div>
              </div>
            </Card>

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
                  I&apos;m hiring on behalf of a company.
                </p>
                <div className="flex items-center gap-2 text-sm text-accent font-medium pt-4">
                  <span>→</span>
                  <span>Continue</span>
                </div>
              </div>
            </Card>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Operations access is provisioned internally. Providers continue here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-light tracking-tight">
              {providerType === 'recruiter'
                ? 'Set Up Your Recruiter Profile'
                : 'Set Up Your Company Profile'}
            </h1>
            <p className="text-muted-foreground">
              Tell us who you hire for and where you’re hiring.
            </p>
          </div>

          <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

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

              {providerType === 'recruiter' && (
                <div className="space-y-2">
                  <label htmlFor="company" className="block text-sm font-medium">
                    Recruiting Agency / Company
                  </label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your agency or company name"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={isLoading}
                    className="bg-input border-border/40"
                  />
                </div>
              )}

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

              <div className="space-y-2">
                <label htmlFor="contactPhone" className="block text-sm font-medium">
                  Contact Phone
                </label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  disabled={isLoading}
                  className="bg-input border-border/40"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="block text-sm font-medium">
                  Website
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

              <div className="space-y-2">
                <label htmlFor="linkedinUrl" className="block text-sm font-medium">
                  LinkedIn / Company Page
                </label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/company/example"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  disabled={isLoading}
                  className="bg-input border-border/40"
                />
              </div>

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
                <p className="text-xs text-muted-foreground">
                  Separate regions with commas.
                </p>
              </div>

              {providerType === 'company' && (
                <div className="space-y-2">
                  <label htmlFor="companySize" className="block text-sm font-medium">
                    Company Size
                  </label>
                  <Input
                    id="companySize"
                    type="text"
                    placeholder="e.g., 11-50, 51-200, 1000+"
                    value={formData.companySize}
                    onChange={(e) => handleInputChange('companySize', e.target.value)}
                    disabled={isLoading}
                    className="bg-input border-border/40"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Hiring Context
                </label>
                <textarea
                  id="description"
                  placeholder="Tell us what kind of talent you usually hire and what matters in your process."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className="w-full bg-input border border-border/40 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-muted-foreground">
                <p>
                  ✓ After setup, you can post roles and coordinate matches through your provider dashboard.
                </p>
              </div>

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
                  {isLoading ? 'Saving...' : 'Next: Post a Job'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}