'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventForm } from '@/components/EventForm';
import { EventFormValues } from '@/lib/schema';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateEvent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/events', data);
      if (response.data.success) {
        toast.success('Event created successfully');
        
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>Fill in the details below to create a new event.</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
