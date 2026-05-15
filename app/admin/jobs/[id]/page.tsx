'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await fetch(`/api/admin/jobs/${id}`);
        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);
          alert(data.error || 'Failed to load job');
          return;
        }

        console.log('ADMIN JOB DETAIL:', data.job);

        setJob(data.job);
      } catch (error) {
        console.error(error);
        alert('Something went wrong while loading job');
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading job...
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <Link href="/admin">
            <Button variant="outline">← Back</Button>
          </Link>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground">
              Job not found.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">

        <Link href="/admin">
          <Button variant="outline">
            ← Back
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-4xl font-light tracking-tight">
            {job.title}
          </h1>

          <p className="text-muted-foreground">
            {job.location || 'Unknown Location'} • {job.job_type || 'Unknown Type'}
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-light">
            Job Details
          </h2>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Status:</span>{' '}
              {job.is_active ? 'Active' : 'Inactive'}
            </p>

            <p>
              <span className="font-medium">Salary:</span>{' '}
              {job.salary_range || 'Not added'}
            </p>

            <p>
              <span className="font-medium">Created:</span>{' '}
              {job.created_at
                ? new Date(job.created_at).toLocaleString()
                : 'Unknown'}
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-light">
            Description
          </h2>

          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {job.description || 'No description'}
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-light">
            Requirements
          </h2>

          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {job.requirements || 'No requirements'}
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-light">
            Provider
          </h2>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Company:</span>{' '}
              {job.provider?.company_name || 'Unknown'}
            </p>

            <p>
              <span className="font-medium">Email:</span>{' '}
              {job.provider?.contact_email || 'Not added'}
            </p>

            <p>
              <span className="font-medium">Type:</span>{' '}
              {job.provider?.provider_type || 'Not added'}
            </p>
          </div>

          {job.provider?.id && (
            <Link href={`/admin/providers/${job.provider.id}`}>
              <Button variant="outline">
                View Provider
              </Button>
            </Link>
          )}
        </Card>

      </div>
    </div>
  );
}