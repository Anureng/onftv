import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  eventName: string;
  eventDate: Date;
  speakerName: string;
  speakerDesignation: string;
  description?: string;
  speakerIntro?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    speakerName: { type: String, required: true },
    speakerDesignation: { type: String, required: true },
    description: { type: String },
    speakerIntro: { type: String },
  },
  { timestamps: true }
);

export const Event = model<IEvent>('Event', eventSchema);
