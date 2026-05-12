'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Tab = 'overview' | 'seekers' | 'providers' | 'meetings';

export default function AdminWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const seekers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'under-review',
      profileCompletion: 100,
      joinDate: '2025-05-10',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'approved',
      profileCompletion: 100,
      joinDate: '2025-05-08',
    },
    {
      id: 3,
      name: 'Carlos Rodriguez',
      email: 'carlos@example.com',
      status: 'pending-documents',
      profileCompletion: 85,
      joinDate: '2025-05-09',
    },
  ];

  const providers = [
    {
      id: 1,
      name: 'Tech Recruiting Inc',
      type: 'recruiter',
      status: 'active',
      jobsPosted: 1,
      joinDate: '2025-05-10',
    },
    {
      id: 2,
      name: 'Global Corp',
      type: 'company',
      status: 'active',
      jobsPosted: 2,
      joinDate: '2025-05-07',
    },
  ];

  const meetings = [
    {
      id: 1,
      seekerName: 'John Doe',
      providerName: 'Tech Recruiting Inc',
      scheduledDate: '2025-05-15',
      status: 'scheduled',
      notes: '',
    },
    {
      id: 2,
      seekerName: 'Jane Smith',
      providerName: 'Global Corp',
      scheduledDate: '2025-05-13',
      status: 'completed',
      notes: 'Great fit for senior role',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'completed':
        return 'text-accent';
      case 'under-review':
      case 'scheduled':
        return 'text-blue-500';
      case 'pending-documents':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'completed':
        return 'bg-accent/10';
      case 'under-review':
      case 'scheduled':
        return 'bg-blue-500/10';
      case 'pending-documents':
        return 'bg-yellow-500/10';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-light tracking-tight">
              Operations Control Center
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage seekers, providers, and coordinate opportunities
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Total Seekers</p>
              <p className="text-3xl font-light">12</p>
              <p className="text-xs text-accent">+3 this week</p>
            </Card>
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Total Providers</p>
              <p className="text-3xl font-light">8</p>
              <p className="text-xs text-accent">+1 this week</p>
            </Card>
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Active Meetings</p>
              <p className="text-3xl font-light">5</p>
              <p className="text-xs text-muted-foreground">This week</p>
            </Card>
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
              <p className="text-3xl font-light">3</p>
              <p className="text-xs text-yellow-500">Action needed</p>
            </Card>
          </div>

          {/* Tabs */}
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
            {/* Tab Navigation */}
            <div className="border-b border-border/40 flex">
              {(['overview', 'seekers', 'providers', 'meetings'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? 'text-foreground border-b-2 border-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-light">Quick Overview</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Recent Activity</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Profiles reviewed</span>
                          <span className="font-medium">8 of 12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Matches created</span>
                          <span className="font-medium">5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Meetings completed</span>
                          <span className="font-medium">2</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Platform Health</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">System uptime</span>
                          <span className="font-medium text-accent">99.9%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg response time</span>
                          <span className="font-medium">145ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Active users</span>
                          <span className="font-medium">18</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seekers' && (
                <div className="space-y-6">
                  <div className="flex gap-4 items-center">
                    <Input
                      type="text"
                      placeholder="Search seekers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-input border-border/40 max-w-xs"
                    />
                    <Button variant="outline" className="rounded-full border-border/40 text-xs">
                      Filter
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {seekers.map((seeker) => (
                      <div key={seeker.id} className="border border-border/40 rounded-lg p-4 hover:bg-card/60 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{seeker.name}</p>
                            <p className="text-xs text-muted-foreground">{seeker.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-xs">
                              <p className="text-muted-foreground">Joined</p>
                              <p className="font-medium">{seeker.joinDate}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(seeker.status)} ${getStatusBg(seeker.status)}`}>
                                {seeker.status.replace(/-/g, ' ')}
                              </span>
                            </div>
                            <Button variant="outline" className="rounded-full border-border/40 text-xs">
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'providers' && (
                <div className="space-y-6">
                  <div className="flex gap-4 items-center">
                    <Input
                      type="text"
                      placeholder="Search providers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-input border-border/40 max-w-xs"
                    />
                    <Button variant="outline" className="rounded-full border-border/40 text-xs">
                      Filter
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {providers.map((provider) => (
                      <div key={provider.id} className="border border-border/40 rounded-lg p-4 hover:bg-card/60 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{provider.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{provider.type}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-xs">
                              <p className="text-muted-foreground">Jobs Posted</p>
                              <p className="font-medium">{provider.jobsPosted}</p>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(provider.status)} ${getStatusBg(provider.status)}`}>
                              {provider.status}
                            </span>
                            <Button variant="outline" className="rounded-full border-border/40 text-xs">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'meetings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-light">Meeting Coordination</h3>
                  <div className="space-y-2">
                    {meetings.map((meeting) => (
                      <div key={meeting.id} className="border border-border/40 rounded-lg p-4 hover:bg-card/60 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {meeting.seekerName} ↔ {meeting.providerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Scheduled: {meeting.scheduledDate}
                            </p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(meeting.status)} ${getStatusBg(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </div>
                        {meeting.notes && (
                          <p className="text-xs text-muted-foreground mt-2 p-2 bg-card/40 rounded">
                            {meeting.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
