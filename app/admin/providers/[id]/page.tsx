'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const res = await fetch(`/api/admin/providers/${id}`);
        const data = await res.json();

        if (!res.ok) {
  console.error(data.error);
  alert(data.error);
  return;
}

        setProvider(data.provider);
      } finally {
        setIsLoading(false);
      }
    };

    loadProvider();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading provider...</div>;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/admin">
          <Button variant="outline">← Back</Button>
        </Link>

        <h1 className="text-4xl font-light">
          {provider?.company_name || 'Provider'}
        </h1>

        <Card className="p-6 space-y-3">
          <p>Type: {provider?.provider_type}</p>
          <p>Contact: {provider?.contact_person_name || 'Not added'}</p>
          <p>Email: {provider?.contact_email}</p>
          <p>Phone: {provider?.contact_phone || 'Not added'}</p>
          <p>Website: {provider?.company_website || 'Not added'}</p>
          <p>Regions: {provider?.hiring_regions?.join(', ') || 'Not added'}</p>
          <p>Description: {provider?.description || 'Not added'}</p>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-light">Job Postings</h2>
          {provider?.job_postings?.length ? (
            provider.job_postings.map((job: any) => (
              <div key={job.id} className="border rounded-lg p-4">
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-muted-foreground">{job.location} • {job.job_type}</p>
              </div>
            ))
          ) : (
            <p>No jobs posted.</p>
          )}
        </Card>
      </div>
    </div>
  );
}