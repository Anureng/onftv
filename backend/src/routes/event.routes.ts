import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { eventSchema } from '../schemas/event.schema';

const router = Router();

router.post('/', validateRequest(eventSchema), eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

router.post('/generate-content', eventController.generateContent);

export default router;
