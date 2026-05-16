'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type Tab =
  | 'overview'
  | 'seekers'
  | 'providers'
  | 'jobs'
  | 'requests';

export default function AdminWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [seekers, setSeekers] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [
          seekersRes,
          providersRes,
          jobsRes,
          requestsRes,
        ] = await Promise.all([
          fetch('/api/admin/seekers'),
          fetch('/api/admin/providers'),
          fetch('/api/admin/jobs'),
          fetch('/api/admin/requests'),
        ]);

        const seekersData = await seekersRes.json();
        const providersData = await providersRes.json();
        const jobsData = await jobsRes.json();
        const requestsData = await requestsRes.json();

        setSeekers(seekersData.seekers || []);
        setProviders(providersData.providers || []);
        setJobs(jobsData.jobs || []);
        setRequests(requestsData.requests || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const filteredSeekers = useMemo(() => {
    return seekers.filter((seeker) => {
      const name = seeker.full_legal_name || `${seeker.first_name || ''} ${seeker.last_name || ''}`;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading admin workspace...</p>
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
              Manage seekers, providers, jobs, and requests
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

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
              Jobs
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

          <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-6">
            <p className="text-sm text-muted-foreground">
              Requests
            </p>

            <p className="text-3xl font-light mt-2">
              {requests.length}
            </p>
          </Card>

        </div>

        <div className="flex flex-wrap gap-3">
          {(
            [
              'overview',
              'seekers',
              'providers',
              'jobs',
              'requests',
            ] as Tab[]
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2 rounded-full text-sm transition-all outline-none ${
                activeTab === tab
                  ? 'text-accent-foreground'
                  : 'bg-card/40 border border-border/40 text-muted-foreground hover:bg-card/60 hover:text-foreground'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="admin-active-tab"
                  className="absolute inset-0 bg-accent rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 capitalize">{tab}</span>
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

        <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >

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
                      {seeker.full_legal_name || `${seeker.first_name || ''} ${seeker.last_name || ''}`.trim() || 'Unnamed Seeker'}
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

          </motion.div>
        )}

        {activeTab === 'seekers' && (
          <motion.div
            key="seekers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredSeekers.map((seeker) => (
              <Card
                key={seeker.id}
                className="border-border/40 bg-card/40 backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {seeker.full_legal_name || `${seeker.first_name || ''} ${seeker.last_name || ''}`.trim() || 'Unnamed Seeker'}
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
                        {seeker.total_it_experience ?? seeker.years_experience ?? 0} yrs exp
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
          </motion.div>
        )}

        {activeTab === 'providers' && (
          <motion.div
            key="providers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
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
          </motion.div>
        )}

        {activeTab === 'jobs' && (
          <motion.div
            key="jobs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
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
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {requests.map((request) => (
              <Card
                key={request.id}
                className="border-border/40 bg-card/40 backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {request.request_type}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {request.requester_role}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {request.message || 'No message'}
                    </p>
                  </div>

                  <div className="text-right space-y-2">
                    <p className="text-sm">
                      {request.status}
                    </p>

                    <div className="space-y-3">
  <input
    type="text"
    placeholder="Meeting link (optional)"
    id={`meeting-${request.id}`}
    className="w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-xs"
  />

  <div className="flex gap-2 justify-end">
    <button
      onClick={async () => {
        const meetingLink = (
          document.getElementById(
            `meeting-${request.id}`
          ) as HTMLInputElement
        )?.value;

        await fetch('/api/admin/requests', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: request.id,
            request_status: 'approved',
            meeting_link: meetingLink || null,
          }),
        });

        location.reload();
      }}
      className="text-xs text-accent hover:underline"
    >
      Approve
    </button>

    <button
      onClick={async () => {
        await fetch('/api/admin/requests', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: request.id,
            request_status: 'rejected',
          }),
        });

        location.reload();
      }}
      className="text-xs text-red-400 hover:underline"
    >
      Reject
    </button>
  </div>
</div>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}