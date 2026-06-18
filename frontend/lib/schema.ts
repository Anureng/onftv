import * as z from 'zod';

export const eventFormSchema = z.object({
  eventName: z.string().min(2, {
    message: 'Event name must be at least 2 characters.',
  }),
  eventDate: z.date({
    message: 'A date of event is required.',
  }),
  speakerName: z.string().min(2, {
    message: 'Speaker name must be at least 2 characters.',
  }),
  speakerDesignation: z.string().min(2, {
    message: 'Speaker designation must be at least 2 characters.',
  }),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export interface IEvent {
  _id: string;
  eventName: string;
  eventDate: string;
  speakerName: string;
  speakerDesignation: string;
  description?: string;
  speakerIntro?: string;
  createdAt: string;
  updatedAt: string;
}
