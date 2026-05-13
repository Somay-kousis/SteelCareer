'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { createJobPosting } from '@/lib/api';

export default function JobPostingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    jobTitle: '',
    jobType: 'Full-time',
    seniority: 'Mid',
    location: '',
    salary: '',
    description: '',
    requirements: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      await createJobPosting({
        title: formData.jobTitle,
        description: formData.description,
        requirements: formData.requirements || 'Not specified',
        salary_range: formData.salary || null,
        location: formData.location,
        job_type: `${formData.jobType} · ${formData.seniority}`,
        is_active: true,
      });

      router.push('/provider/dashboard');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to publish job');
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete =
    formData.jobTitle &&
    formData.location &&
    formData.description &&
    formData.requirements;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-light tracking-tight">
              Post Your First Job
            </h1>
            <p className="text-muted-foreground">
              Tell us about the opportunity you&apos;re hiring for
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
                <label htmlFor="jobTitle" className="block text-sm font-medium">
                  Job Title
                </label>
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g., Senior Product Manager"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-input border-border/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="jobType" className="block text-sm font-medium">
                    Job Type
                  </label>
                  <select
                    id="jobType"
                    value={formData.jobType}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-input border border-border/40 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Remote</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="seniority" className="block text-sm font-medium">
                    Seniority
                  </label>
                  <select
                    id="seniority"
                    value={formData.seniority}
                    onChange={(e) => handleInputChange('seniority', e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-input border border-border/40 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                  >
                    <option>Entry</option>
                    <option>Mid</option>
                    <option>Senior</option>
                    <option>Lead</option>
                    <option>Executive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={isLoading}
                    required
                    className="bg-input border-border/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="salary" className="block text-sm font-medium">
                  Salary Range
                </label>
                <Input
                  id="salary"
                  type="text"
                  placeholder="e.g., $80K - $120K USD"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  disabled={isLoading}
                  className="bg-input border-border/40"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Job Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isLoading}
                  required
                  rows={5}
                  className="w-full bg-input border border-border/40 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="requirements" className="block text-sm font-medium">
                  Key Requirements
                </label>
                <textarea
                  id="requirements"
                  placeholder="List must-have skills, experience, visa requirements, language requirements, etc."
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  disabled={isLoading}
                  required
                  rows={4}
                  className="w-full bg-input border border-border/40 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-muted-foreground">
                <p>
                  ✓ After posting, this role will be saved to your provider account and surfaced for matching.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => router.push('/provider/dashboard')}
                  className="flex-1 rounded-full border-border/40"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={!isComplete || isLoading}
                  className="flex-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isLoading ? 'Publishing...' : 'Publish Job'}
                </Button>
              </div>
            </form>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            You can edit or post more jobs from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
}