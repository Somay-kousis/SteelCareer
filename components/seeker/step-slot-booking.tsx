'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { updateSeeker, fetchSeeker } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calendar as CalendarIcon, Video, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const slotBookingSchema = z.object({
  preferred_screening_platform: z.string().min(1, 'Please select a platform'),
  available_slots: z.array(z.string()).min(1, 'Please select at least one slot'),
});

type SlotBookingValues = z.infer<typeof slotBookingSchema>;

const MOCK_SLOTS = [
  'Tomorrow, 10:00 AM EST',
  'Tomorrow, 2:00 PM EST',
  'Next Monday, 11:00 AM EST',
  'Next Tuesday, 3:00 PM EST',
  'Next Wednesday, 1:00 PM EST'
];

export function StepSlotBooking({ onPrevious }: { onPrevious: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const form = useForm<SlotBookingValues>({
    resolver: zodResolver(slotBookingSchema),
    defaultValues: {
      preferred_screening_platform: '',
      available_slots: [],
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { seeker } = await fetchSeeker();
        if (seeker) {
          form.reset({
            preferred_screening_platform: seeker.preferred_screening_platform || '',
            available_slots: Array.isArray(seeker.available_slots) ? seeker.available_slots : [],
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

  const toggleSlot = (slot: string) => {
    const currentSlots = form.getValues('available_slots');
    if (currentSlots.includes(slot)) {
      form.setValue('available_slots', currentSlots.filter(s => s !== slot));
    } else {
      form.setValue('available_slots', [...currentSlots, slot]);
    }
  };

  const onSubmit = async (data: SlotBookingValues) => {
    setIsLoading(true);
    try {
      await updateSeeker({
        ...data,
        status: 'active', // Mark onboarding as complete!
        onboarding_completed_at: new Date().toISOString()
      });
      setIsCompleted(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to schedule screening.',
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

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
      >
        <Card className="border-border/40 shadow-xl bg-card/60 backdrop-blur-sm text-center py-12">
          <CardContent className="space-y-6 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="bg-accent/20 p-4 rounded-full"
            >
              <CheckCircle2 className="w-16 h-16 text-accent" />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-3xl font-light">You're all set!</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                We've received your profile and screening preferences. We will reach out shortly to confirm your meeting time.
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-full mt-4"
              onClick={() => window.location.href = '/seeker/dashboard'}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </motion.div>
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
          <CardTitle className="text-2xl font-light">Screening Slot</CardTitle>
          <CardDescription>
            Let's book a quick consultation to discuss your profile. Your first call is completely free.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="slot-booking-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="preferred_screening_platform" className="flex items-center gap-2">
                <Video className="w-4 h-4 text-muted-foreground" />
                Preferred Platform
              </Label>
              <Select
                name="preferred_screening_platform"
                onValueChange={(value) => form.setValue('preferred_screening_platform', value, { shouldValidate: true })}
                value={form.watch('preferred_screening_platform')}
              >
                <SelectTrigger id="preferred_screening_platform" className="w-full">
                  <SelectValue placeholder="Select platform (e.g. Google Meet)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_meet">Google Meet</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="microsoft_teams">Microsoft Teams</SelectItem>
                  <SelectItem value="skype">Skype</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.preferred_screening_platform && (
                <p className="text-sm text-destructive">{form.formState.errors.preferred_screening_platform.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                Select Availability
              </Label>
              <p className="text-sm text-muted-foreground">Pick one or more times that work for you.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_SLOTS.map((slot) => {
                  const isSelected = form.watch('available_slots').includes(slot);
                  return (
                    <div
                      key={slot}
                      onClick={() => toggleSlot(slot)}
                      className={`cursor-pointer rounded-lg border p-4 text-center transition-all duration-200 ${
                        isSelected 
                          ? 'border-accent bg-accent/10 text-accent font-medium shadow-sm' 
                          : 'border-border/60 hover:border-accent/40 hover:bg-accent/5'
                      }`}
                    >
                      {slot}
                    </div>
                  );
                })}
              </div>
              {form.formState.errors.available_slots && (
                <p className="text-sm text-destructive">{form.formState.errors.available_slots.message}</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t border-border/40 mt-4">
          <Button variant="outline" type="button" onClick={onPrevious} disabled={isLoading} className="rounded-full px-6">
            Back
          </Button>
          <Button form="slot-booking-form" type="submit" disabled={isLoading} size="lg" className="rounded-full px-8">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Finish Onboarding
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
