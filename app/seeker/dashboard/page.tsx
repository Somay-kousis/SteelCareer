'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchSeeker } from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type Seeker = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  current_title?: string | null;
  years_experience?: number | null;
  target_roles?: string[] | null;
  linkedin_profile?: string | null;
  github_profile?: string | null;
  website_url?: string | null;
  resume_url?: string | null;
  cover_letter_url?: string | null;
  support_areas?: string[] | null;
  onboarding_completed_at?: string | null;
  legal_status?: string | null;
  work_authorization?: string | null;
  highest_education?: string | null;
  current_location?: string | null;
  preferred_screening_platform?: string | null;
};

export default function SeekerDashboard() {
  const [seeker, setSeeker] = useState<Seeker | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSeeker = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSeeker();
        setSeeker(data.seeker);

        const requestsRes = await fetch('/api/requests');
        const requestsData = await requestsRes.json();
        setRequests(requestsData.requests || []);
      } catch (err) {
        console.error('Failed to load seeker:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadSeeker();
  }, []);

  const completion = useMemo(() => {
    if (!seeker) return 0;

    const fields = [
      seeker.first_name,
      seeker.last_name,
      seeker.email,
      seeker.phone,
      seeker.legal_status,
      seeker.work_authorization,
      seeker.highest_education,
      seeker.current_location,
      seeker.preferred_screening_platform,
    ];

    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [seeker]);

  const firstName = seeker?.first_name || 'there';
  const fullName = [seeker?.first_name, seeker?.last_name].filter(Boolean).join(' ') || 'Your profile';
  const isComplete = Boolean(seeker?.onboarding_completed_at || seeker?.status === 'active');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-4 text-center shadow-xl">
          <h1 className="text-xl font-light">Couldn&apos;t load dashboard</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link href="/auth/signin">
            <Button className="rounded-full bg-accent text-accent-foreground mt-4">
              Sign in again
            </Button>
          </Link>
        </Card>
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
                Welcome back, {firstName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {seeker?.current_title || 'Your career journey at Steelcareer'}
              </p>
            </div>

            <Link href="/seeker/onboarding/steps/1">
              <Button className="rounded-full shadow-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-all">
                Edit Profile
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-4 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Profile Completion</h3>
                  <span className="text-lg text-accent font-medium">{completion}%</span>
                </div>

                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-1000 ease-out"
                    style={{ width: `${completion}%` }}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {isComplete
                    ? 'Your profile is complete and ready for review'
                    : 'Complete onboarding to improve your match quality'}
                </p>
              </Card>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-4 shadow-lg hover:shadow-xl transition-all h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Review Status</h3>
                  <span className="text-sm text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {isComplete ? 'In Progress' : 'Incomplete'}
                  </span>
                </div>

                <p className="text-sm">
                  {isComplete
                    ? 'Our team is reviewing your profile'
                    : 'Finish onboarding to enter review'}
                </p>

                <p className="text-xs text-muted-foreground">
                  {isComplete
                    ? 'You&apos;ll hear from us within 2-3 business days'
                    : 'Your profile is saved as you progress'}
                </p>
              </Card>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-4 shadow-lg hover:shadow-xl transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Opportunities</h3>
                    <span className="text-lg text-accent font-medium">0</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Waiting for matches from providers
                  </p>
                </div>
                <Button variant="outline" className="w-full rounded-full border-border/40 text-xs mt-4 hover:bg-card">
                  View All
                </Button>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-8 space-y-6 shadow-lg">
                  <div>
                    <h2 className="text-xl font-light tracking-tight">Profile Snapshot</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your current information from onboarding
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium mt-1">{fullName}</p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium mt-1">{seeker?.email || 'Not added'}</p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium mt-1">{seeker?.current_location || 'Not added'}</p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="font-medium mt-1">
                        {seeker?.years_experience != null
                          ? `${seeker.years_experience} years`
                          : 'Not added'}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-card/40 p-4 md:col-span-2">
                      <p className="text-xs text-muted-foreground">Work Authorization</p>
                      <p className="font-medium mt-1 capitalize">
                        {seeker?.work_authorization ? seeker.work_authorization.replace('_', ' ') : 'Not added'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-8 space-y-6 shadow-lg">
                  <div>
                    <h2 className="text-xl font-light tracking-tight">What&apos;s Next?</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Here&apos;s what we recommend to maximize your opportunities
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/40 transition-colors hover:bg-card/60">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-accent">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Profile Created</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your profile exists and is saved in the system.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/40 transition-colors hover:bg-card/60">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isComplete ? 'bg-accent/20' : 'bg-muted'}`}>
                        <span className={`text-xs ${isComplete ? 'text-accent' : 'text-muted-foreground'}`}>{isComplete ? '✓' : '2'}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Onboarding Submitted</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isComplete
                            ? 'Your profile is ready to be reviewed.'
                            : 'Complete onboarding to begin review.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/40 transition-colors hover:bg-card/60">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-muted-foreground">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Team Review</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Our team will review your profile and prepare matches.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <Card className="border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-4 shadow-lg">
                  <h3 className="text-sm font-medium">Quick Links</h3>
                  <div className="space-y-2">
                    {seeker?.linkedin_profile && (
                      <a
                        href={seeker.linkedin_profile}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-card/80"
                      >
                        <span>→</span> LinkedIn Profile
                      </a>
                    )}

                    {seeker?.github_profile && (
                      <a
                        href={seeker.github_profile}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-card/80"
                      >
                        <span>→</span> GitHub Profile
                      </a>
                    )}

                    {!seeker?.linkedin_profile && !seeker?.github_profile && (
                      <p className="text-sm text-muted-foreground p-2">
                        No external links added.
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-6 space-y-4 shadow-lg">
                  <div>
                    <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Consultation Call
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with our team for guidance and screening.
                    </p>
                  </div>

                  {requests.length > 0 ? (
                    <div className="space-y-3 bg-card/40 p-3 rounded-lg border border-border/40">
                      <p className="text-sm">
                        Status:{' '}
                        <span className="text-accent font-medium">
                          {requests[0].status}
                        </span>
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
                              request_type: 'schedule_call',
                              message: 'Seeker requested a consultation call.',
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
                      Schedule Call
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