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

const locationSalarySchema = z.object({
  current_location: z.string().min(1, 'Current location is required'),
  permanent_address: z.string().min(1, 'Permanent address is required'),
  preferred_locations: z.string().min(1, 'Preferred locations are required'),
  expected_salary: z.string().min(1, 'Expected salary is required'),
  hourly_rate: z.string().optional(),
});

type LocationSalaryValues = z.infer<typeof locationSalarySchema>;

export function StepLocationSalary({ onNext, onPrevious }: { onNext: () => void; onPrevious: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const form = useForm<LocationSalaryValues>({
    resolver: zodResolver(locationSalarySchema),
    defaultValues: {
      current_location: '',
      permanent_address: '',
      preferred_locations: '',
      expected_salary: '',
      hourly_rate: '',
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { seeker } = await fetchSeeker();
        if (seeker) {
          form.reset({
            current_location: seeker.current_location || '',
            permanent_address: seeker.permanent_address || '',
            preferred_locations: Array.isArray(seeker.preferred_locations) ? seeker.preferred_locations.join(', ') : seeker.preferred_locations || '',
            expected_salary: seeker.expected_salary || '',
            hourly_rate: seeker.hourly_rate || '',
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

  const onSubmit = async (data: LocationSalaryValues) => {
    setIsLoading(true);
    try {
      // Clean numeric strings of currency symbols and commas before parsing
      const cleanNumber = (val?: string) => {
        if (!val) return null;
        const cleaned = val.replace(/[^0-9.-]+/g, "");
        return cleaned ? Number(cleaned) : null;
      };

      const payload = {
        ...data,
        preferred_locations: data.preferred_locations.split(',').map(s => s.trim()).filter(Boolean),
        expected_salary: cleanNumber(data.expected_salary),
        hourly_rate: cleanNumber(data.hourly_rate),
      };
      await updateSeeker(payload);
      onNext();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save location details.',
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
          <CardTitle className="text-2xl font-light">Location & Salary</CardTitle>
          <CardDescription>
            Where you are, where you want to be, and your compensation expectations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="location-salary-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="current_location">Current Location</Label>
                <Input
                  id="current_location"
                  placeholder="e.g., New York, NY"
                  {...form.register('current_location')}
                />
                {form.formState.errors.current_location && (
                  <p className="text-sm text-destructive">{form.formState.errors.current_location.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="permanent_address">Permanent Address</Label>
                <Input
                  id="permanent_address"
                  placeholder="e.g., 123 Main St, City, State"
                  {...form.register('permanent_address')}
                />
                {form.formState.errors.permanent_address && (
                  <p className="text-sm text-destructive">{form.formState.errors.permanent_address.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_locations">Preferred Locations <span className="text-muted-foreground text-xs font-normal">(comma separated)</span></Label>
              <Input
                id="preferred_locations"
                placeholder="e.g., Remote, Austin, TX, Chicago, IL"
                {...form.register('preferred_locations')}
              />
              {form.formState.errors.preferred_locations && (
                <p className="text-sm text-destructive">{form.formState.errors.preferred_locations.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="expected_salary">Expected Salary (Annual)</Label>
                <Input
                  id="expected_salary"
                  placeholder="e.g., $120,000"
                  {...form.register('expected_salary')}
                />
                {form.formState.errors.expected_salary && (
                  <p className="text-sm text-destructive">{form.formState.errors.expected_salary.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Hourly Rate <span className="text-muted-foreground text-xs font-normal">(For contract roles)</span></Label>
                <Input
                  id="hourly_rate"
                  placeholder="e.g., $60/hr"
                  {...form.register('hourly_rate')}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" type="button" onClick={onPrevious} disabled={isLoading} className="rounded-full px-6">
            Back
          </Button>
          <Button form="location-salary-form" type="submit" disabled={isLoading} size="lg" className="rounded-full px-8">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
