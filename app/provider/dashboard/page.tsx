'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchJobs, fetchProvider } from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type Provider = {
  company_name?: string | null;
  contact_email?: string | null;
  description?: string | null;
  hiring_regions?: string[] | null;
  hiring_roles?: string[] | null;
  hiring_volume?: string | null;
  preferred_candidate_experience?: string | null;
  work_authorization_requirements?: string | null;
  remote_policy?: string | null;
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
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [providerData, jobsData, requestsRes] = await Promise.all([
          fetchProvider().catch(() => ({ provider: null })),
          fetchJobs().catch(() => ({ jobs: [] })),
          fetch('/api/requests'),
        ]);

        const requestsData = await requestsRes.json();

        setProvider(providerData?.provider || null);
        setRequests(requestsData?.requests || []);

        const filteredJobs =
          jobsData?.jobs?.filter(
            (job: any) =>
              job.provider?.company_name === providerData?.provider?.company_name
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
    () => jobs.filter((job) => job.is_active !== false),
    [jobs]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />

      <div className="relative z-10">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-40 border-b border-border/20 bg-background/40 backdrop-blur-md"
        >
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
              <Button className="rounded-full shadow-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-all">
                Post New Job
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-2 shadow-lg hover:shadow-xl transition-all h-full">
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-3xl font-light text-foreground">{activeJobs.length}</p>
                <p className="text-xs text-muted-foreground">Live opportunities</p>
              </Card>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-2 shadow-lg hover:shadow-xl transition-all h-full">
                <p className="text-sm text-muted-foreground">Matched Candidates</p>
                <p className="text-3xl font-light text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Matching system coming next</p>
              </Card>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-2 shadow-lg hover:shadow-xl transition-all h-full">
                <p className="text-sm text-muted-foreground">Meetings Scheduled</p>
                <p className="text-3xl font-light text-foreground">
                  {requests.filter((request) => request.meeting_link).length}
                </p>
                <p className="text-xs text-muted-foreground">Approved calls with links</p>
              </Card>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-2 shadow-lg hover:shadow-xl transition-all h-full">
                <p className="text-sm text-muted-foreground">Profile Status</p>
                <p className="text-sm font-medium text-accent bg-accent/10 w-fit px-2 py-0.5 rounded-full mt-1">Complete</p>
                <p className="text-xs text-muted-foreground mt-2">Visible in system</p>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-8 space-y-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-light tracking-tight">Your Job Postings</h2>
                    <Link href="/provider/job-posting">
                      <Button variant="outline" className="rounded-full border-border/40 text-xs hover:bg-card">
                        New Job
                      </Button>
                    </Link>
                  </div>

                  {activeJobs.length === 0 ? (
                    <div className="border border-dashed border-border/40 bg-card/20 rounded-xl p-10 text-center space-y-3">
                      <p className="text-lg font-light">No jobs posted yet</p>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Create your first opportunity to start receiving matches.
                      </p>
                      <Link href="/provider/job-posting" className="inline-block mt-4">
                        <Button className="rounded-full shadow-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-all">
                          Create Job
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeJobs.map((job) => (
                        <div
                          key={job.id}
                          className="border border-border/40 bg-card/40 rounded-xl p-6 hover:bg-card/80 transition-colors shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-medium text-base">{job.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(job.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-xs px-3 py-1 bg-accent/10 text-accent rounded-full border border-accent/20">
                              Active
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            {job.location} • {job.job_type}
                          </p>

                          {job.salary_range && <p className="text-sm mb-3 font-medium text-foreground/80">{job.salary_range}</p>}

                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {job.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-8 space-y-6 shadow-lg">
                  <h2 className="text-xl font-light tracking-tight">Organization Profile</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="font-medium mt-1">{provider?.company_name || 'Not added'}</p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                      <p className="text-xs text-muted-foreground">Contact Email</p>
                      <p className="font-medium mt-1">{provider?.contact_email || 'Not added'}</p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4 md:col-span-2">
                      <p className="text-xs text-muted-foreground">Hiring Regions</p>
                      <p className="font-medium mt-1">
                        {provider?.hiring_regions?.length
                          ? provider.hiring_regions.join(', ')
                          : 'Not added'}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4 md:col-span-2">
                      <p className="text-xs text-muted-foreground">Hiring Roles</p>
                      <p className="font-medium mt-1">
                        {provider?.hiring_roles?.length
                          ? provider.hiring_roles.join(', ')
                          : 'Not added'}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                      <p className="text-xs text-muted-foreground">Hiring Volume</p>
                      <p className="font-medium mt-1">{provider?.hiring_volume || 'Not added'}</p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                      <p className="text-xs text-muted-foreground">Preferred Experience</p>
                      <p className="font-medium mt-1">{provider?.preferred_candidate_experience || 'Not added'}</p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                      <p className="text-xs text-muted-foreground">Work Authorization Req</p>
                      <p className="font-medium mt-1">{provider?.work_authorization_requirements || 'Not added'}</p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                      <p className="text-xs text-muted-foreground">Remote Policy</p>
                      <p className="font-medium mt-1">{provider?.remote_policy || 'Not added'}</p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4 md:col-span-2">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="font-medium mt-1 text-muted-foreground">
                        {provider?.description || 'No description added'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-4 shadow-lg">
                  <h3 className="text-sm font-medium">Quick Links</h3>

                  <div className="space-y-2">
                    <Link
                      href="/provider/job-posting"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-card/80"
                    >
                      <span>→</span> Create New Job
                    </Link>

                    <Link
                      href="/provider/onboarding"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-card/80"
                    >
                      <span>→</span> Edit Profile
                    </Link>
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-4 shadow-lg">
                  <h3 className="text-sm font-medium">Next Steps</h3>

                  <div className="space-y-3 text-sm mt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-xs text-accent">✓</span>
                      </div>
                      <span className="text-muted-foreground">Provider profile complete</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-xs text-accent">✓</span>
                      </div>
                      <span className="text-muted-foreground">System connected</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">→</span>
                      </div>
                      <span className="text-foreground font-medium">Candidate matching next</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-6 space-y-4 shadow-lg">
                  <div>
                    <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Support Request</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Need help sourcing international talent?
                    </p>
                  </div>

                  {requests.length > 0 ? (
                    <div className="space-y-3 bg-card/40 p-3 rounded-lg border border-border/40">
                      <p className="text-sm">
                        Status:{' '}
                        <span className="text-accent font-medium">{requests[0].status}</span>
                      </p>

                      {requests[0].meeting_link && (
                        <a
                          href={requests[0].meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-center text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors rounded-full py-2"
                        >
                          Join Meeting
                        </a>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/requests', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              request_type: 'provider_support',
                              message: 'Provider requested support with hiring or sourcing.',
                            }),
                          });

                          const data = await response.json();

                          if (!response.ok) {
                            alert(data.error || 'Failed to create request');
                            return;
                          }

                          location.reload();
                        } catch (error) {
                          console.error(error);
                          alert('Something went wrong');
                        }
                      }}
                      className="w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-700 text-sm shadow-sm"
                    >
                      Contact Support
                    </Button>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}