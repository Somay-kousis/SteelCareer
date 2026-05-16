'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { updateSeeker, fetchSeeker } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const workAuthSchema = z.object({
  legal_status: z.string().min(1, 'Legal status is required'),
  work_authorization: z.string().min(1, 'Work authorization is required'),
  open_to_relocate: z.boolean().default(false),
});

type WorkAuthValues = z.infer<typeof workAuthSchema>;

export function StepWorkAuth({ onNext, onPrevious }: { onNext: () => void; onPrevious: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const form = useForm<WorkAuthValues>({
    resolver: zodResolver(workAuthSchema),
    defaultValues: {
      legal_status: '',
      work_authorization: '',
      open_to_relocate: false,
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { seeker } = await fetchSeeker();
        if (seeker) {
          form.reset({
            legal_status: seeker.legal_status || '',
            work_authorization: seeker.work_authorization || '',
            open_to_relocate: seeker.open_to_relocate || false,
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

  const onSubmit = async (data: WorkAuthValues) => {
    setIsLoading(true);
    try {
      await updateSeeker(data);
      onNext();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save work authorization details.',
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="border-border/40 shadow-xl bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-light">Work Authorization</CardTitle>
          <CardDescription>
            Help us understand your eligibility to work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="work-auth-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="legal_status">Current Legal Status</Label>
              <Select
                name="legal_status"
                onValueChange={(value) => form.setValue('legal_status', value, { shouldValidate: true })}
                value={form.watch('legal_status')}
              >
                <SelectTrigger id="legal_status">
                  <SelectValue placeholder="Select your legal status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="citizen">Citizen</SelectItem>
                  <SelectItem value="permanent_resident">Permanent Resident / Green Card</SelectItem>
                  <SelectItem value="visa_holder">Visa Holder (e.g., H1B, F1)</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.legal_status && (
                <p className="text-sm text-destructive">{form.formState.errors.legal_status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="work_authorization">Work Authorization Needed?</Label>
              <Select
                name="work_authorization"
                onValueChange={(value) => form.setValue('work_authorization', value, { shouldValidate: true })}
                value={form.watch('work_authorization')}
              >
                <SelectTrigger id="work_authorization">
                  <SelectValue placeholder="Do you require sponsorship?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_required">No sponsorship required</SelectItem>
                  <SelectItem value="required_now">Yes, I require sponsorship now</SelectItem>
                  <SelectItem value="required_future">Yes, I will require sponsorship in the future</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.work_authorization && (
                <p className="text-sm text-destructive">{form.formState.errors.work_authorization.message}</p>
              )}
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border border-border/40 p-4 bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="open_to_relocate" className="text-base">
                  Open to Relocate
                </Label>
                <p className="text-sm text-muted-foreground">
                  Are you willing to relocate for the right opportunity?
                </p>
              </div>
              <Switch
                id="open_to_relocate"
                checked={form.watch('open_to_relocate')}
                onCheckedChange={(checked) => form.setValue('open_to_relocate', checked)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" type="button" onClick={onPrevious} disabled={isLoading} className="rounded-full px-6">
            Back
          </Button>
          <Button form="work-auth-form" type="submit" disabled={isLoading} size="lg" className="rounded-full px-8">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
