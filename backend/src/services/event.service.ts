import { Event, IEvent } from '../models/event.model';
import { EventInput } from '../schemas/event.schema';

export const createEvent = async (data: EventInput): Promise<IEvent> => {
  const event = new Event(data);
  return await event.save();
};

export const getAllEvents = async (): Promise<IEvent[]> => {
  return await Event.find().sort({ createdAt: -1 });
};

export const getEventById = async (id: string): Promise<IEvent | null> => {
  return await Event.findById(id);
};

export const updateEvent = async (id: string, data: Partial<IEvent>): Promise<IEvent | null> => {
  return await Event.findByIdAndUpdate(id, data, { new: true });
};

export const deleteEvent = async (id: string): Promise<IEvent | null> => {
  return await Event.findByIdAndDelete(id);
};
