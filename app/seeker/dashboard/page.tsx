'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchSeeker } from '@/lib/api';

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
        setSeeker(data.seeker);
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
      seeker.current_title,
      seeker.years_experience,
      seeker.target_roles?.length,
      seeker.linkedin_profile || seeker.github_profile || seeker.website_url,
      seeker.resume_url,
      seeker.support_areas?.length,
    ];

    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [seeker]);

  const firstName = seeker?.first_name || 'there';
  const fullName = [seeker?.first_name, seeker?.last_name].filter(Boolean).join(' ') || 'Your profile';
  const isComplete = Boolean(seeker?.onboarding_completed_at || seeker?.status === 'active');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-4 text-center">
          <h1 className="text-xl font-light">Couldn&apos;t load dashboard</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link href="/signin">
            <Button className="rounded-full bg-accent text-accent-foreground">
              Sign in again
            </Button>
          </Link>
        </Card>
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
                Welcome back, {firstName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {seeker?.current_title || 'Your career journey at Steelcareer'}
              </p>
            </div>

            <Link href="/seeker/onboarding/steps/1">
              <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Profile Completion</h3>
                <span className="text-lg text-accent">{completion}%</span>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {isComplete
                  ? 'Your profile is complete and ready for review'
                  : 'Complete onboarding to improve your match quality'}
              </p>
            </Card>

            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Review Status</h3>
                <span className="text-sm text-accent">
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

            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Opportunities</h3>
                <span className="text-lg text-accent">0</span>
              </div>

              <p className="text-xs text-muted-foreground">
                Waiting for matches from providers
              </p>

              <Button variant="outline" className="w-full rounded-lg border-border/40 text-xs">
                View All
              </Button>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-light tracking-tight">Profile Snapshot</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your current information from onboarding
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg border border-border/40 bg-card/20 p-4">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium mt-1">{fullName}</p>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-card/20 p-4">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium mt-1">{seeker?.email || 'Not added'}</p>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-card/20 p-4">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium mt-1">{seeker?.phone || 'Not added'}</p>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-card/20 p-4">
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-medium mt-1">
                      {seeker?.years_experience != null
                        ? `${seeker.years_experience} years`
                        : 'Not added'}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-card/20 p-4 md:col-span-2">
                    <p className="text-xs text-muted-foreground">Target Roles / Goals</p>
                    <p className="font-medium mt-1">
                      {seeker?.target_roles?.length
                        ? seeker.target_roles.join(', ')
                        : 'Not added'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-light tracking-tight">What&apos;s Next?</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Here&apos;s what we recommend to maximize your opportunities
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/20">
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

                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/20">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-accent">{isComplete ? '✓' : '2'}</span>
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

                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/20">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
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
            </div>

            <div className="space-y-6">
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-3">
                <h3 className="text-sm font-medium">Documents</h3>

                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Resume:{' '}
                    <span className={seeker?.resume_url ? 'text-accent' : ''}>
                      {seeker?.resume_url ? 'Uploaded' : 'Missing'}
                    </span>
                  </p>

                  <p className="text-muted-foreground">
                    Cover letter:{' '}
                    <span className={seeker?.cover_letter_url ? 'text-accent' : ''}>
                      {seeker?.cover_letter_url ? 'Uploaded' : 'Optional'}
                    </span>
                  </p>
                </div>

                <Link href="/seeker/onboarding/steps/5">
                  <Button variant="outline" className="w-full rounded-lg border-border/40 text-xs">
                    Manage Documents
                  </Button>
                </Link>
              </Card>

              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-3">
                <h3 className="text-sm font-medium">Support Requested</h3>

                {seeker?.support_areas?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {seeker.support_areas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full border border-border/40 bg-card/30 px-3 py-1 text-xs text-muted-foreground"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No support preferences selected yet.
                  </p>
                )}
              </Card>

              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-3">
                <h3 className="text-sm font-medium">Quick Links</h3>
                <div className="space-y-2">
                  {seeker?.linkedin_profile && (
                    <a
                      href={seeker.linkedin_profile}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>→</span> LinkedIn
                    </a>
                  )}

                  {seeker?.github_profile && (
                    <a
                      href={seeker.github_profile}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>→</span> GitHub
                    </a>
                  )}

                  {seeker?.website_url && (
                    <a
                      href={seeker.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>→</span> Portfolio
                    </a>
                  )}

                  {!seeker?.linkedin_profile && !seeker?.github_profile && !seeker?.website_url && (
                    <p className="text-sm text-muted-foreground">
                      No profile links added yet.
                    </p>
                  )}
                </div>
              </Card>

              <Card className="border-accent/40 bg-accent/5 backdrop-blur-sm p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Questions about your next steps? Our team is here to help.
                </p>
<Card className="border-accent/40 bg-accent/5 backdrop-blur-sm p-6 space-y-4">
  <div>
    <h3 className="text-sm font-medium">
      Consultation Request
    </h3>

    <p className="text-sm text-muted-foreground mt-1">
      Connect with our team for guidance and onboarding help.
    </p>
  </div>

  {requests.length > 0 ? (
    <div className="space-y-2">
      <p className="text-sm">
        Latest Status:{' '}
        <span className="text-accent">
          {requests[0].status}
        </span>
      </p>

      {requests[0].meeting_link && (
        <a
          href={requests[0].meeting_link}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-accent underline"
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
      className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-sm"
    >
      Schedule a Call
    </Button>
  )}
</Card>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}