'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EventForm } from '@/components/EventForm';
import { EventFormValues, IEvent } from '@/lib/schema';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SparklesIcon, DownloadIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function EditEvent() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [eventData, setEventData] = useState<IEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${eventId}`);
        if (response.data.success) {
          setEventData(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch event details');
        router.push('/');
      }
    };
    fetchEvent();
  }, [eventId, router]);

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/events/${eventId}`, data);
      if (response.data.success) {
        toast.success('Event updated successfully');
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!eventData) return;
    setIsGenerating(true);
    try {
      const response = await api.post('/events/generate-content', {
        eventName: eventData.eventName,
        speakerName: eventData.speakerName,
        speakerDesignation: eventData.speakerDesignation,
      });

      if (response.data.success) {
        const { description, speakerIntro } = response.data.data;
        
        const updateRes = await api.put(`/events/${eventId}`, {
          description,
          speakerIntro,
        });

        if (updateRes.data.success) {
          setEventData(updateRes.data.data);
          toast.success('AI content generated and saved successfully!');
        }
      }
    } catch (error: any) {
      toast.error('Failed to generate AI content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (!eventData) return;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Event Details', 14, 22);

    doc.setFontSize(12);
    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Value']],
      body: [
        ['Event Name', eventData.eventName],
        ['Event Date', new Date(eventData.eventDate).toLocaleDateString()],
        ['Speaker', eventData.speakerName],
        ['Designation', eventData.speakerDesignation],
      ],
    });

    let currentY = (doc as any).lastAutoTable.finalY + 10;

    if (eventData.description) {
      doc.setFontSize(14);
      doc.text('Event Description', 14, currentY);
      doc.setFontSize(11);
      const splitDesc = doc.splitTextToSize(eventData.description, 180);
      doc.text(splitDesc, 14, currentY + 7);
      currentY += (splitDesc.length * 6) + 10;
    }

    if (eventData.speakerIntro) {
      doc.setFontSize(14);
      doc.text('Speaker Introduction', 14, currentY);
      doc.setFontSize(11);
      const splitIntro = doc.splitTextToSize(eventData.speakerIntro, 180);
      doc.text(splitIntro, 14, currentY + 7);
    }

    doc.save(`${eventData.eventName.replace(/\s+/g, '_')}_Details.pdf`);
    toast.success('PDF exported successfully');
  };

  if (!eventData) {
    return <div className="flex justify-center items-center h-64">Loading event...</div>;
  }

  const initialValues: EventFormValues = {
    eventName: eventData.eventName,
    eventDate: new Date(eventData.eventDate),
    speakerName: eventData.speakerName,
    speakerDesignation: eventData.speakerDesignation,
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Event</CardTitle>
            <CardDescription>Update the details of your event.</CardDescription>
          </CardHeader>
          <CardContent>
            <EventForm initialData={initialValues} onSubmit={onSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI & Tools</CardTitle>
            <CardDescription>Enhance your event listing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              onClick={handleGenerateAI}
              disabled={isGenerating}
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Description'}
            </Button>
            <Button 
              className="w-full" 
              variant="outline" 
              onClick={handleExportPDF}
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
          </CardContent>
        </Card>

        {(eventData.description || eventData.speakerIntro) && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {eventData.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Description</h4>
                  <p className="text-gray-600">{eventData.description}</p>
                </div>
              )}
              {eventData.speakerIntro && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Speaker Intro</h4>
                  <p className="text-gray-600">{eventData.speakerIntro}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
