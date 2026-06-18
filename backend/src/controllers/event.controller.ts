import { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/event.service';
import * as aiService from '../services/ai.service';

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.getEventById(req.params.id as string);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.updateEvent(req.params.id as string, req.body);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.deleteEvent(req.params.id as string);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const generateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventName, speakerName, speakerDesignation } = req.body;
    if (!eventName || !speakerName || !speakerDesignation) {
      return res.status(400).json({ success: false, message: 'Missing required fields for AI generation' });
    }
    const content = await aiService.generateEventContent(eventName, speakerName, speakerDesignation);
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};
