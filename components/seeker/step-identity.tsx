'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { updateSeeker, fetchSeeker } from '@/lib/api';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

const identitySchema = z.object({
  full_legal_name: z.string().min(2, 'Full legal name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(5, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  linkedin_url: z.string().url('Valid LinkedIn URL is required').optional().or(z.literal('')),
  skype_id: z.string().optional(),
});

type IdentityValues = z.infer<typeof identitySchema>;

export function StepIdentity({ onNext }: { onNext: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const form = useForm<IdentityValues>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      full_legal_name: '',
      date_of_birth: '',
      phone: '',
      email: '',
      linkedin_url: '',
      skype_id: '',
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const [seekerResponse, authResponse] = await Promise.all([
          fetchSeeker().catch(() => ({ seeker: null })),
          supabase.auth.getUser()
        ]);
        
        const seeker = seekerResponse?.seeker;
        const user = authResponse.data?.user;

        if (seeker || user) {
          form.reset({
            full_legal_name: seeker?.full_legal_name || '',
            date_of_birth: seeker?.date_of_birth || '',
            phone: seeker?.phone || '',
            email: seeker?.email || user?.email || '',
            linkedin_url: seeker?.linkedin_url || '',
            skype_id: seeker?.skype_id || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch seeker data', error);
      } finally {
        setIsFetching(false);
      }
    }
    loadData();
  }, [form]);

  const onSubmit = async (data: IdentityValues) => {
    setIsLoading(true);
    try {
      await updateSeeker(data);
      onNext();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save identity details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="border-border/40 shadow-xl bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-light">Let&apos;s start with the basics</CardTitle>
          <CardDescription>
            Tell us who you are so we can build your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="identity-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_legal_name">Full Legal Name</Label>
              <Input
                id="full_legal_name"
                placeholder="John Doe"
                {...form.register('full_legal_name')}
              />
              {form.formState.errors.full_legal_name && (
                <p className="text-sm text-destructive">{form.formState.errors.full_legal_name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...form.register('date_of_birth')}
                />
                {form.formState.errors.date_of_birth && (
                  <p className="text-sm text-destructive">{form.formState.errors.date_of_birth.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  {...form.register('phone')}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Email Address</Label>
              <div className="flex flex-col gap-1.5 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <a href={`mailto:${form.watch('email')}`} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                  {form.watch('email') || 'Loading...'}
                </a>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600/80 dark:text-emerald-400/80">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified from your account</span>
                </div>
              </div>
              <input type="hidden" {...form.register('email')} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                <Input
                  id="linkedin_url"
                  placeholder="https://linkedin.com/in/johndoe"
                  {...form.register('linkedin_url')}
                />
                {form.formState.errors.linkedin_url && (
                  <p className="text-sm text-destructive">{form.formState.errors.linkedin_url.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="skype_id">Skype ID <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                <Input
                  id="skype_id"
                  placeholder="live:johndoe"
                  {...form.register('skype_id')}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button form="identity-form" type="submit" disabled={isLoading} size="lg" className="rounded-full px-8">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
