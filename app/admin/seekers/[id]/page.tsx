'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminSeekerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [seeker, setSeeker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSeeker = async () => {
      try {
        const res = await fetch(`/api/admin/seekers/${id}`);
        const data = await res.json();

        if (!res.ok) {
  console.error(data.error);
  alert(data.error);
  return;
}

        setSeeker(data.seeker);
      } finally {
        setIsLoading(false);
      }
    };

    

    loadSeeker();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading seeker...</div>;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/admin">
          <Button variant="outline">← Back</Button>
        </Link>

        <h1 className="text-4xl font-light">
          {seeker?.first_name} {seeker?.last_name}
        </h1>

        <Card className="p-6 space-y-3">
          <p>Email: {seeker?.email}</p>
          <p>Phone: {seeker?.phone || 'Not added'}</p>
          <p>Status: {seeker?.status}</p>
          <p>Current Title: {seeker?.current_title || 'Not added'}</p>
          <p>Experience: {seeker?.years_experience ?? 0} years</p>
          <p>Goals: {seeker?.target_roles?.join(', ') || 'Not added'}</p>
          <p>Support: {seeker?.support_areas?.join(', ') || 'Not added'}</p>
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-light">Links & Documents</h2>
          <p>LinkedIn: {seeker?.linkedin_profile || 'Not added'}</p>
          <p>GitHub: {seeker?.github_profile || 'Not added'}</p>
          <p>Website: {seeker?.website_url || 'Not added'}</p>
          <p>Resume: {seeker?.resume_url ? 'Uploaded' : 'Missing'}</p>
          {seeker?.resume_url && (
            <a href={seeker.resume_url} target="_blank" rel="noreferrer" className="text-accent underline">
              Open Resume
            </a>
          )}
        </Card>
      </div>
    </div>
  );
}