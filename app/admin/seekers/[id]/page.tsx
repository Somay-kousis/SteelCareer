'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading seeker profile...</p>
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

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-light tracking-tight">
              {seeker?.full_legal_name || `${seeker?.first_name || ''} ${seeker?.last_name || ''}`.trim() || 'Unnamed Candidate'}
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {seeker?.status || 'Active'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {seeker?.free_call_used ? (
              <Badge variant="secondary" className="bg-muted text-muted-foreground">Free Call Used</Badge>
            ) : (
              <Badge variant="default" className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30">Free Call Available</Badge>
            )}
          </div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-light flex items-center gap-2">👤 Identity</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <DetailItem label="Full Legal Name" value={seeker?.full_legal_name} />
              <DetailItem label="Email" value={seeker?.email} />
              <DetailItem label="Phone" value={seeker?.phone} />
              <DetailItem label="Date of Birth" value={seeker?.date_of_birth} />
              <DetailItem label="Skype ID" value={seeker?.skype_id} />
              <DetailItem label="LinkedIn" value={seeker?.linkedin_url} />
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-light flex items-center gap-2">⚖️ Work Auth</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <DetailItem label="Legal Status" value={seeker?.legal_status} />
              <DetailItem label="Work Authorization" value={seeker?.work_authorization} />
              <DetailItem label="Open to Relocate" value={seeker?.open_to_relocate ? 'Yes' : 'No'} />
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-light flex items-center gap-2">💼 Experience</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <DetailItem label="Highest Education" value={seeker?.highest_education} />
              <DetailItem label="Graduation Year" value={seeker?.graduation_year} />
              <DetailItem label="Total IT Experience" value={seeker?.total_it_experience ? `${seeker.total_it_experience} years` : null} />
              <DetailItem label="Current Employer" value={seeker?.current_employer} />
              <DetailItem label="Current Project Status" value={seeker?.current_project_status} />
              <DetailItem label="Notice Period" value={seeker?.notice_period} />
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-light flex items-center gap-2">📍 Location & Salary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <DetailItem label="Current Location" value={seeker?.current_location} />
              <DetailItem label="Permanent Address" value={seeker?.permanent_address} />
              <DetailItem label="Preferred Locations" value={seeker?.preferred_locations?.join(', ')} />
              <DetailItem label="Expected Salary" value={seeker?.expected_salary ? `$${seeker.expected_salary.toLocaleString()}` : null} />
              <DetailItem label="Hourly Rate" value={seeker?.hourly_rate ? `$${seeker.hourly_rate}/hr` : null} />
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-light flex items-center gap-2">📅 Screening</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <DetailItem label="Preferred Platform" value={seeker?.preferred_screening_platform} />
              <DetailItem label="Available Slots" value={seeker?.available_slots?.join(' • ')} />
              <DetailItem label="References" value={seeker?.professional_references} />
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-light flex items-center gap-2">🔗 External Links</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {seeker?.linkedin_url ? (
                <a href={seeker.linkedin_url.startsWith('http') ? seeker.linkedin_url : `https://${seeker.linkedin_url}`} target="_blank" rel="noreferrer" className="text-accent underline text-sm block">
                  LinkedIn Profile ↗
                </a>
              ) : <p className="text-sm text-muted-foreground">No LinkedIn URL provided</p>}
              
              {seeker?.website_url && (
                <a href={seeker.website_url.startsWith('http') ? seeker.website_url : `https://${seeker.website_url}`} target="_blank" rel="noreferrer" className="text-accent underline text-sm block">
                  Personal Website ↗
                </a>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}