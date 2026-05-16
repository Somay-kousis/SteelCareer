'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { updateProvider } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

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
    hiringRoles: '',
    hiringVolume: '',
    preferredExperience: '',
    workAuthReqs: '',
    remotePolicy: '',
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
        hiring_roles: splitList(formData.hiringRoles),
        hiring_volume: formData.hiringVolume || null,
        preferred_candidate_experience: formData.preferredExperience || null,
        work_authorization_requirements: formData.workAuthReqs || null,
        remote_policy: formData.remotePolicy || null,
      });

      router.push('/provider/job-posting');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save provider profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

      <AnimatePresence mode="wait">
        {step === 'type' ? (
          <motion.div 
            key="type-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-3xl w-full mx-auto px-6 space-y-12 py-12"
          >
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-light tracking-tight">
                Welcome to Steelcareer
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Connect with pre-screened international talent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                onClick={() => handleTypeSelect('recruiter')}
                className="relative group cursor-pointer border-border/40 bg-card/60 backdrop-blur-sm hover:-translate-y-1 hover:shadow-2xl hover:border-accent/40 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-10 space-y-6">
                  <div className="text-4xl bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center">👤</div>
                  <div>
                    <h3 className="text-2xl font-light tracking-tight mb-2">
                      Recruiting Professional
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      I&apos;m an independent recruiter or agency looking to source talent.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-accent font-medium pt-4 group-hover:translate-x-1 transition-transform">
                    <span>Continue</span>
                    <span>→</span>
                  </div>
                </div>
              </Card>

              <Card
                onClick={() => handleTypeSelect('company')}
                className="relative group cursor-pointer border-border/40 bg-card/60 backdrop-blur-sm hover:-translate-y-1 hover:shadow-2xl hover:border-accent/40 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-10 space-y-6">
                  <div className="text-4xl bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center">🏢</div>
                  <div>
                    <h3 className="text-2xl font-light tracking-tight mb-2">
                      Company / Organization
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      I&apos;m hiring on behalf of a company.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-accent font-medium pt-4 group-hover:translate-x-1 transition-transform">
                    <span>Continue</span>
                    <span>→</span>
                  </div>
                </div>
              </Card>
            </div>

            <p className="text-center text-xs text-muted-foreground/60">
              Operations access is provisioned internally. Providers continue here.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="info-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-2xl px-6 py-12 pb-24 mx-auto space-y-8"
          >
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

            <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-8 space-y-6 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive flex items-center gap-2">
                    <span className="shrink-0">⚠️</span> {error}
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
                  <Select
                    name="companySize"
                    value={formData.companySize}
                    onValueChange={(value) => handleInputChange('companySize', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="companySize" className="bg-input border-border/40">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="hiringRoles" className="block text-sm font-medium">
                  Primary Roles Hiring For
                </label>
                <Input
                  id="hiringRoles"
                  type="text"
                  placeholder="e.g., Software Engineer, Data Scientist"
                  value={formData.hiringRoles}
                  onChange={(e) => handleInputChange('hiringRoles', e.target.value)}
                  disabled={isLoading}
                  className="bg-input border-border/40"
                />
                <p className="text-xs text-muted-foreground">Separate roles with commas.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="hiringVolume" className="block text-sm font-medium">
                    Hiring Volume (Yearly)
                  </label>
                  <Select
                    name="hiringVolume"
                    value={formData.hiringVolume}
                    onValueChange={(value) => handleInputChange('hiringVolume', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="hiringVolume" className="bg-input border-border/40">
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 hires</SelectItem>
                      <SelectItem value="6-20">6-20 hires</SelectItem>
                      <SelectItem value="21-50">21-50 hires</SelectItem>
                      <SelectItem value="50+">50+ hires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="preferredExperience" className="block text-sm font-medium">
                    Preferred Candidate Level
                  </label>
                  <Select
                    name="preferredExperience"
                    value={formData.preferredExperience}
                    onValueChange={(value) => handleInputChange('preferredExperience', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="preferredExperience" className="bg-input border-border/40">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead/Manager">Lead/Manager</SelectItem>
                      <SelectItem value="Any">Any Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="workAuthReqs" className="block text-sm font-medium">
                    Work Authorization
                  </label>
                  <Select
                    name="workAuthReqs"
                    value={formData.workAuthReqs}
                    onValueChange={(value) => handleInputChange('workAuthReqs', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="workAuthReqs" className="bg-input border-border/40">
                      <SelectValue placeholder="Select requirements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US Citizen/Green Card">US Citizen / Green Card only</SelectItem>
                      <SelectItem value="Visa Sponsorship Available">Visa Sponsorship Available</SelectItem>
                      <SelectItem value="Any">Any / Not applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="remotePolicy" className="block text-sm font-medium">
                    Remote Policy
                  </label>
                  <Select
                    name="remotePolicy"
                    value={formData.remotePolicy}
                    onValueChange={(value) => handleInputChange('remotePolicy', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="remotePolicy" className="bg-input border-border/40">
                      <SelectValue placeholder="Select remote policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fully Remote">Fully Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

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

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep('type');
                    setProviderType(null);
                  }}
                  disabled={isLoading}
                  className="flex-1 rounded-full border-border/40 hover:bg-card"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}