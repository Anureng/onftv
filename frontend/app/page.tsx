'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IEvent } from '@/lib/schema';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, UserIcon, TrashIcon, EditIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Dashboard() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        if (response.data.success) {
          setEvents(response.data.data);
        }
      } catch {
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
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
    } catch {
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
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Speaker</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event._id}>
                  <TableCell className="font-medium">{event.eventName}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-gray-500 whitespace-nowrap">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {format(new Date(event.eventDate), 'PPP')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center whitespace-nowrap">
                      <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {event.speakerName}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{event.speakerDesignation}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/edit/${event._id}`}>
                        <Button variant="outline" size="sm" title="Edit Event">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" title="Delete Event" onClick={() => handleDelete(event._id)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
