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

const experienceSchema = z.object({
  highest_education: z.string().min(1, 'Highest education is required'),
  graduation_year: z.string().min(4, 'Graduation year is required'),
  total_it_experience: z.string().min(1, 'Total IT experience is required'),
  current_employer: z.string().optional(),
  current_project_status: z.string().optional(),
  notice_period: z.string().min(1, 'Notice period is required'),
});

type ExperienceValues = z.infer<typeof experienceSchema>;

export function StepExperience({ onNext, onPrevious }: { onNext: () => void; onPrevious: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const form = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      highest_education: '',
      graduation_year: '',
      total_it_experience: '',
      current_employer: '',
      current_project_status: '',
      notice_period: '',
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { seeker } = await fetchSeeker();
        if (seeker) {
          form.reset({
            highest_education: seeker.highest_education || '',
            graduation_year: seeker.graduation_year || '',
            total_it_experience: seeker.total_it_experience?.toString() || '',
            current_employer: seeker.current_employer || '',
            current_project_status: seeker.current_project_status || '',
            notice_period: seeker.notice_period || '',
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

  const onSubmit = async (data: ExperienceValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        total_it_experience: data.total_it_experience ? Number(data.total_it_experience) : null,
        graduation_year: data.graduation_year ? Number(data.graduation_year) : null,
      };
      await updateSeeker(payload);
      onNext();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save experience details.',
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
          <CardTitle className="text-2xl font-light">Experience & Background</CardTitle>
          <CardDescription>
            Tell us about your professional journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="experience-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="highest_education">Highest Education</Label>
                <Select
                  name="highest_education"
                  onValueChange={(value) => form.setValue('highest_education', value, { shouldValidate: true })}
                  value={form.watch('highest_education')}
                >
                  <SelectTrigger id="highest_education">
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.highest_education && (
                  <p className="text-sm text-destructive">{form.formState.errors.highest_education.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduation_year">Graduation Year</Label>
                <Input
                  id="graduation_year"
                  placeholder="e.g., 2020"
                  {...form.register('graduation_year')}
                />
                {form.formState.errors.graduation_year && (
                  <p className="text-sm text-destructive">{form.formState.errors.graduation_year.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_it_experience">Total IT Experience (Years)</Label>
              <Input
                id="total_it_experience"
                placeholder="e.g., 5"
                type="number"
                {...form.register('total_it_experience')}
              />
              {form.formState.errors.total_it_experience && (
                <p className="text-sm text-destructive">{form.formState.errors.total_it_experience.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="current_employer">Current Employer <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                <Input
                  id="current_employer"
                  placeholder="Company Name"
                  {...form.register('current_employer')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_project_status">Current Project Status <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                <Select
                  name="current_project_status"
                  onValueChange={(value) => form.setValue('current_project_status', value, { shouldValidate: true })}
                  value={form.watch('current_project_status')}
                >
                  <SelectTrigger id="current_project_status">
                    <SelectValue placeholder="Project Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="ending_soon">Ending Soon</SelectItem>
                    <SelectItem value="completed">Completed / On Bench</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notice_period">Notice Period</Label>
              <Select
                name="notice_period"
                onValueChange={(value) => form.setValue('notice_period', value, { shouldValidate: true })}
                value={form.watch('notice_period')}
              >
                <SelectTrigger id="notice_period">
                  <SelectValue placeholder="Select notice period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="15_days">15 Days</SelectItem>
                  <SelectItem value="30_days">30 Days</SelectItem>
                  <SelectItem value="60_days">60 Days</SelectItem>
                  <SelectItem value="90_days">90+ Days</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.notice_period && (
                <p className="text-sm text-destructive">{form.formState.errors.notice_period.message}</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" type="button" onClick={onPrevious} disabled={isLoading} className="rounded-full px-6">
            Back
          </Button>
          <Button form="experience-form" type="submit" disabled={isLoading} size="lg" className="rounded-full px-8">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
