'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SeekerDashboard() {
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
                Welcome back, John
              </h1>
              <p className="text-sm text-muted-foreground">
                Your career journey at Steelcareer
              </p>
            </div>
            <Link href="/seeker/onboarding/steps/1">
              <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          {/* Profile Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Completion Status */}
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Profile Completion</h3>
                <span className="text-lg text-accent">100%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent w-full" />
              </div>
              <p className="text-xs text-muted-foreground">
                Your profile is complete and visible to providers
              </p>
            </Card>

            {/* Review Status */}
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Review Status</h3>
                <span className="text-sm text-accent">In Progress</span>
              </div>
              <p className="text-sm">
                Our team is reviewing your profile
              </p>
              <p className="text-xs text-muted-foreground">
                You&apos;ll hear from us within 2-3 business days
              </p>
            </Card>

            {/* Matched Opportunities */}
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

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Key Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* What&apos;s Next Section */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-light tracking-tight">What&apos;s Next?</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Here&apos;s what we recommend to maximize your opportunities
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Task Item 1 */}
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/20 hover:bg-card/40 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-accent">✓</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Profile Created</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You&apos;re all set! Your profile is ready to be reviewed.
                      </p>
                    </div>
                  </div>

                  {/* Task Item 2 */}
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/20 hover:bg-card/40 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-muted-foreground">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Team Review</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Our team will personalize your matches (2-3 business days)
                      </p>
                    </div>
                  </div>

                  {/* Task Item 3 */}
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/20 hover:bg-card/40 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-muted-foreground">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Review Matches</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You&apos;ll receive personalized opportunity matches via email
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Support & Resources */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
                <h2 className="text-xl font-light tracking-tight">Support & Resources</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 rounded-lg border border-border/40 bg-card/20 hover:bg-card/40 hover:border-border/60 transition-all text-left group">
                    <div className="text-lg mb-2">📚</div>
                    <p className="text-sm font-medium">Career Tips</p>
                    <p className="text-xs text-muted-foreground mt-1">Articles and guidance</p>
                  </button>
                  <button className="p-4 rounded-lg border border-border/40 bg-card/20 hover:bg-card/40 hover:border-border/60 transition-all text-left group">
                    <div className="text-lg mb-2">💬</div>
                    <p className="text-sm font-medium">Contact Us</p>
                    <p className="text-xs text-muted-foreground mt-1">Get help from our team</p>
                  </button>
                  <button className="p-4 rounded-lg border border-border/40 bg-card/20 hover:bg-card/40 hover:border-border/60 transition-all text-left group">
                    <div className="text-lg mb-2">🎯</div>
                    <p className="text-sm font-medium">Interview Prep</p>
                    <p className="text-xs text-muted-foreground mt-1">Practice resources</p>
                  </button>
                  <button className="p-4 rounded-lg border border-border/40 bg-card/20 hover:bg-card/40 hover:border-border/60 transition-all text-left group">
                    <div className="text-lg mb-2">🌐</div>
                    <p className="text-sm font-medium">Community</p>
                    <p className="text-xs text-muted-foreground mt-1">Connect with peers</p>
                  </button>
                </div>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Links */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-3">
                <h3 className="text-sm font-medium">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/seeker/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>→</span> View Opportunities
                  </Link>
                  <Link href="/seeker/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>→</span> Manage Documents
                  </Link>
                  <Link href="/seeker/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>→</span> Meeting Calendar
                  </Link>
                  <Link href="/seeker/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>→</span> Account Settings
                  </Link>
                </div>
              </Card>

              {/* Stats */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-4">
                <h3 className="text-sm font-medium">Your Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profile Views</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connections</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meetings Scheduled</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </Card>

              {/* Help Section */}
              <Card className="border-accent/40 bg-accent/5 backdrop-blur-sm p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Questions about your next steps? Our team is here to help.
                </p>
                <Button className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-sm">
                  Schedule a Call
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
