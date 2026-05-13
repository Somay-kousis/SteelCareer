'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchJobs, fetchProvider } from '@/lib/api';

type Provider = {
  company_name?: string | null;
  contact_person_name?: string | null;
  contact_email?: string | null;
  company_website?: string | null;
  description?: string | null;
  hiring_regions?: string[] | null;
  provider_type?: string | null;
};

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_range?: string | null;
  created_at: string;
  is_active?: boolean;
};

export default function ProviderDashboard() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [providerData, jobsData] = await Promise.all([
          fetchProvider(),
          fetchJobs(),
        ]);

        setProvider(providerData.provider);

        const filteredJobs =
          jobsData.jobs?.filter(
            (job: any) =>
              job.provider?.company_name ===
              providerData.provider?.company_name
          ) || [];

        setJobs(filteredJobs);
      } catch (error) {
        console.error('Dashboard load failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const activeJobs = useMemo(
    () => jobs.filter(job => job.is_active !== false),
    [jobs]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/[0.05] via-transparent to-transparent" />

      <div className="relative z-10">
        <div className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-tight">
                {provider?.company_name || 'Provider'} Dashboard
              </h1>

              <p className="text-sm text-muted-foreground">
                {provider?.provider_type === 'recruiter'
                  ? 'Recruiting Professional'
                  : 'Hiring Organization'}
              </p>
            </div>

            <Link href="/provider/job-posting">
              <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                Post New Job
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Active Jobs</p>
              <p className="text-3xl font-light">
                {activeJobs.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Live opportunities
              </p>
            </Card>

            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                Matched Candidates
              </p>
              <p className="text-3xl font-light">0</p>
              <p className="text-xs text-muted-foreground">
                Matching system coming next
              </p>
            </Card>

            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                Meetings Scheduled
              </p>
              <p className="text-3xl font-light">0</p>
              <p className="text-xs text-muted-foreground">
                No meetings yet
              </p>
            </Card>

            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                Profile Status
              </p>
              <p className="text-sm font-medium text-accent">
                Complete
              </p>
              <p className="text-xs text-muted-foreground">
                Visible in system
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-light tracking-tight">
                    Your Job Postings
                  </h2>

                  <Link href="/provider/job-posting">
                    <Button
                      variant="outline"
                      className="rounded-full border-border/40 text-xs"
                    >
                      New Job
                    </Button>
                  </Link>
                </div>

                {activeJobs.length === 0 ? (
                  <div className="border border-dashed border-border/40 rounded-xl p-10 text-center space-y-3">
                    <p className="text-lg font-light">
                      No jobs posted yet
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Create your first opportunity to start receiving matches.
                    </p>

                    <Link href="/provider/job-posting">
                      <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Create Job
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border border-border/40 rounded-lg p-6 hover:bg-card/60 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-base">
                              {job.title}
                            </h3>

                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(job.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <span className="text-xs px-3 py-1 bg-accent/10 text-accent rounded-full">
                            Active
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {job.location} • {job.job_type}
                        </p>

                        {job.salary_range && (
                          <p className="text-sm mb-3">
                            {job.salary_range}
                          </p>
                        )}

                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {job.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
                <h2 className="text-xl font-light tracking-tight">
                  Organization Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg border border-border/40 bg-card/20 p-4">
                    <p className="text-xs text-muted-foreground">
                      Company
                    </p>
                    <p className="font-medium mt-1">
                      {provider?.company_name || 'Not added'}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-card/20 p-4">
                    <p className="text-xs text-muted-foreground">
                      Contact Email
                    </p>
                    <p className="font-medium mt-1">
                      {provider?.contact_email || 'Not added'}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-card/20 p-4 md:col-span-2">
                    <p className="text-xs text-muted-foreground">
                      Hiring Regions
                    </p>

                    <p className="font-medium mt-1">
                      {provider?.hiring_regions?.length
                        ? provider.hiring_regions.join(', ')
                        : 'Not added'}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-card/20 p-4 md:col-span-2">
                    <p className="text-xs text-muted-foreground">
                      Description
                    </p>

                    <p className="font-medium mt-1">
                      {provider?.description || 'No description added'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-3">
                <h3 className="text-sm font-medium">
                  Quick Links
                </h3>

                <div className="space-y-2">
                  <Link
                    href="/provider/job-posting"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>→</span> Create New Job
                  </Link>

                  <Link
                    href="/provider/onboarding"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>→</span> Edit Profile
                  </Link>
                </div>
              </Card>

              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-3">
                <h3 className="text-sm font-medium">
                  Next Steps
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-muted-foreground">
                      Provider profile complete
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-muted-foreground">
                      System connected
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-muted-foreground">→</span>
                    <span className="text-muted-foreground">
                      Candidate matching next
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="border-accent/40 bg-accent/5 backdrop-blur-sm p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Need help sourcing international talent?
                </p>

                <Button className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-sm">
                  Contact Support
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}