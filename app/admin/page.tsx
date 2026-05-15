'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

type Tab = 'overview' | 'seekers' | 'providers' | 'jobs';

export default function AdminWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [seekers, setSeekers] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [seekersRes, providersRes, jobsRes] =
          await Promise.all([
            fetch('/api/admin/seekers'),
            fetch('/api/admin/providers'),
            fetch('/api/admin/jobs'),
          ]);

        const seekersData = await seekersRes.json();
        const providersData = await providersRes.json();
        const jobsData = await jobsRes.json();

        setSeekers(seekersData.seekers || []);
        setProviders(providersData.providers || []);
        setJobs(jobsData.jobs || []);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const filteredSeekers = useMemo(() => {
    return seekers.filter((seeker) =>
      `${seeker.first_name || ''} ${seeker.last_name || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [seekers, searchTerm]);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) =>
      (provider.company_name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [providers, searchTerm]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      (job.title || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading admin workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light tracking-tight">
              Admin Workspace
            </h1>

            <p className="text-muted-foreground mt-2">
              Manage seekers, providers, and job postings
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Total Platform Users
            </p>

            <p className="text-3xl font-light">
              {seekers.length + providers.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6">
            <p className="text-sm text-muted-foreground">
              Seekers
            </p>

            <p className="text-3xl font-light mt-2">
              {seekers.length}
            </p>
          </Card>

          <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6">
            <p className="text-sm text-muted-foreground">
              Providers
            </p>

            <p className="text-3xl font-light mt-2">
              {providers.length}
            </p>
          </Card>

          <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6">
            <p className="text-sm text-muted-foreground">
              Jobs Posted
            </p>

            <p className="text-3xl font-light mt-2">
              {jobs.length}
            </p>
          </Card>

          <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6">
            <p className="text-sm text-muted-foreground">
              Active Jobs
            </p>

            <p className="text-3xl font-light mt-2">
              {jobs.filter(job => job.is_active).length}
            </p>
          </Card>

        </div>

        <div className="flex flex-wrap gap-3">

          {(['overview', 'seekers', 'providers', 'jobs'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${
                activeTab === tab
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card/40 border border-border/40 text-muted-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

        </div>

        {activeTab !== 'overview' && (
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-input border-border/40"
          />
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-4">
              <h2 className="text-xl font-light">
                Recent Seekers
              </h2>

              <div className="space-y-3">
                {seekers.slice(0, 5).map((seeker) => (
                  <div
                    key={seeker.id}
                    className="border border-border/40 rounded-lg p-4"
                  >
                    <p className="font-medium">
                      {seeker.first_name} {seeker.last_name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {seeker.email}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-4">
              <h2 className="text-xl font-light">
                Recent Jobs
              </h2>

              <div className="space-y-3">
                {jobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="border border-border/40 rounded-lg p-4"
                  >
                    <p className="font-medium">
                      {job.title}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {job.provider?.company_name || 'Unknown Provider'}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        )}

        {activeTab === 'seekers' && (
          <div className="space-y-4">
            {filteredSeekers.map((seeker) => (
              <Card
                key={seeker.id}
                className="border-border/40 bg-card/40 backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {seeker.first_name} {seeker.last_name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {seeker.email}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {seeker.current_title || 'No title'}
                    </p>
                  </div>

<div className="text-right space-y-2">
  <div>
    <p className="text-sm">
      {seeker.status || 'pending'}
    </p>

    <p className="text-xs text-muted-foreground">
      {seeker.years_experience || 0} yrs exp
    </p>
  </div>

  <Link href={`/admin/seekers/${seeker.id}`}>
    <button className="text-sm text-accent hover:underline">
      View Details
    </button>
  </Link>
</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <Card
                key={provider.id}
                className="border-border/40 bg-card/40 backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {provider.company_name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {provider.contact_email}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {provider.provider_type}
                    </p>
                  </div>

<div className="text-right space-y-2">
  <p className="text-sm">
    {provider.verified ? 'Verified' : 'Pending'}
  </p>

  <Link href={`/admin/providers/${provider.id}`}>
    <button className="text-sm text-accent hover:underline">
      View Details
    </button>
  </Link>
</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="border-border/40 bg-card/40 backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {job.title}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {job.provider?.company_name || 'Unknown'}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {job.location} • {job.job_type}
                    </p>
                  </div>
<div className="text-right space-y-2">
  <p className="text-sm">
    {job.is_active ? 'Active' : 'Inactive'}
  </p>

  <Link href={`/admin/jobs/${job.id}`}>
    <button className="text-sm text-accent hover:underline">
      View Details
    </button>
  </Link>
</div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}