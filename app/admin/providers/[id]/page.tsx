'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading provider profile...</p>
      </div>
    );
  }

  const DetailItem = ({ label, value }: { label: string; value: string | number | boolean | null | undefined }) => (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value !== null && value !== undefined && value !== '' ? String(value) : '—'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-6 py-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        <Link href="/admin">
          <Button variant="outline" className="rounded-full shadow-sm hover:bg-card">← Back to Dashboard</Button>
        </Link>

        <div>
          <h1 className="text-4xl font-light tracking-tight">
            {provider?.company_name || 'Unnamed Provider'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {provider?.provider_type === 'recruiter' ? 'Recruiting Professional' : 'Hiring Organization'}
          </p>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-light flex items-center gap-2">🏢 Company Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <DetailItem label="Company Name" value={provider?.company_name} />
              <DetailItem label="Company Size" value={provider?.company_size} />
              <DetailItem label="Website" value={provider?.company_website} />
              <DetailItem label="LinkedIn" value={provider?.linkedin_url} />
              <DetailItem label="Description" value={provider?.description} />
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-light flex items-center gap-2">📞 Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <DetailItem label="Contact Person" value={provider?.contact_person_name} />
              <DetailItem label="Contact Email" value={provider?.contact_email} />
              <DetailItem label="Contact Phone" value={provider?.contact_phone} />
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2">
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-light flex items-center gap-2">🎯 Hiring Preferences</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailItem label="Hiring Regions" value={provider?.hiring_regions?.join(', ')} />
              <DetailItem label="Hiring Roles" value={provider?.hiring_roles?.join(', ')} />
              <DetailItem label="Hiring Volume" value={provider?.hiring_volume} />
              <DetailItem label="Preferred Candidate Exp." value={provider?.preferred_candidate_experience} />
              <DetailItem label="Work Auth Requirements" value={provider?.work_authorization_requirements} />
              <DetailItem label="Remote Policy" value={provider?.remote_policy} />
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2">
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-light flex items-center gap-2">📋 Active Job Postings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {provider?.job_postings?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {provider.job_postings.map((job: any) => (
                    <div key={job.id} className="border border-border/40 bg-card/40 rounded-lg p-4">
                      <p className="font-medium text-lg">{job.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{job.location} • {job.job_type}</p>
                      {job.salary_range && <p className="text-xs text-foreground/80 mt-2">{job.salary_range}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No jobs posted yet.</p>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}