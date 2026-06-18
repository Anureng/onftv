import { z } from 'zod';

export const eventSchema = z.object({
  eventName: z.string().min(1, 'Event name is required').max(100),
  eventDate: z.coerce.date({
    message: 'Event date is required and must be a valid date',
  }),
  speakerName: z.string().min(1, 'Speaker name is required').max(100),
  speakerDesignation: z.string().min(1, 'Speaker designation is required').max(100),
});

export type EventInput = z.infer<typeof eventSchema>;
