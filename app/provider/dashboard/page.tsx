'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/[0.05] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-tight">
                Recruiter Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your job postings and connections
              </p>
            </div>
            <Link href="/provider/job-posting">
              <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                Post New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Active Jobs</p>
              <p className="text-3xl font-light">1</p>
              <p className="text-xs text-muted-foreground">Your posted opportunities</p>
            </Card>
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Matched Candidates</p>
              <p className="text-3xl font-light">0</p>
              <p className="text-xs text-muted-foreground">Waiting for matches</p>
            </Card>
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Meetings Scheduled</p>
              <p className="text-3xl font-light">0</p>
              <p className="text-xs text-muted-foreground">Upcoming conversations</p>
            </Card>
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Profile Status</p>
              <p className="text-sm font-medium text-accent">Complete</p>
              <p className="text-xs text-muted-foreground">Visible to seekers</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Jobs */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-light tracking-tight">
                    Your Job Postings
                  </h2>
                  <Link href="/provider/job-posting">
                    <Button variant="outline" className="rounded-full border-border/40 text-xs">
                      New Job
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {/* Job Card */}
                  <div className="border border-border/40 rounded-lg p-6 hover:bg-card/60 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-base">
                          Senior Product Manager
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Posted 2 days ago
                        </p>
                      </div>
                      <span className="text-xs px-3 py-1 bg-accent/10 text-accent rounded-full">
                        Active
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      San Francisco, CA • Full-time • Senior Level
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Views</p>
                        <p className="font-medium">12</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Applications</p>
                        <p className="font-medium">0</p>
                      </div>
                      <div className="ml-auto">
                        <button className="text-accent hover:text-accent/80 text-xs font-medium">
                          Edit
                        </button>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <button className="text-accent hover:text-accent/80 text-xs font-medium">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* How it Works */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
                <h2 className="text-xl font-light tracking-tight">
                  How It Works
                </h2>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm">Post Your Job</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add details about your opportunity
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm">We Find Matches</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Our team matches qualified seekers to your job
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm">Schedule Meetings</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Connect with pre-qualified candidates
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Links */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-3">
                <h3 className="text-sm font-medium">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/provider/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>→</span> View All Matches
                  </Link>
                  <Link href="/provider/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>→</span> Meeting Calendar
                  </Link>
                  <Link href="/provider/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>→</span> Edit Profile
                  </Link>
                  <Link href="/provider/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>→</span> Account Settings
                  </Link>
                </div>
              </Card>

              {/* Next Steps */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-3">
                <h3 className="text-sm font-medium">Next Steps</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-muted-foreground">Profile complete</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-muted-foreground">First job posted</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">→</span>
                    <span className="text-muted-foreground">Wait for matches (1-2 days)</span>
                  </div>
                </div>
              </Card>

              {/* Support */}
              <Card className="border-accent/40 bg-accent/5 backdrop-blur-sm p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Questions about hiring? Our team is ready to help.
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
