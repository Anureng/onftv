'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IEvent } from '@/lib/schema';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, UserIcon, TrashIcon, EditIcon, FileTextIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Dashboard() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const response = await api.delete(`/events/${id}`);
      if (response.data.success) {
        toast.success('Event deleted successfully');
        setEvents(events.filter(e => e._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading events...</div>;
  }

  const filteredEvents = events.filter(event => 
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.speakerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Events Dashboard</h1>
        <Link href="/create">
          <Button>Create Event</Button>
        </Link>
      </div>

      <div className="max-w-md">
        <Input 
          placeholder="Search events or speakers..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
          <div className="mt-6">
            <Link href="/create">
              <Button>Create your first event</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event._id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{event.eventName}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(new Date(event.eventDate), 'PPP')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserIcon className="h-4 w-4" />
                  <span className="font-medium">{event.speakerName}</span> - {event.speakerDesignation}
                </div>
                {event.description && (
                  <div className="text-sm text-gray-500 line-clamp-3">
                    {event.description}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Link href={`/edit/${event._id}`}>
                  <Button variant="outline" size="sm">
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(event._id)}>
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
