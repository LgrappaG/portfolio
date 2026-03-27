import { Router, Request, Response } from 'express';
import { ContactController } from '@/controllers/ContactController';
import { EmailService } from '@/services/EmailService';
import { contactFormLimiter } from '@/middleware/rateLimitMiddleware';

export function createContactRoutes(): Router {
  const router = Router();
  const emailService = new EmailService();
  const contactController = new ContactController(emailService);

  /**
   * Public Routes (Rate Limited)
   */

  // POST /api/contact/send - Send contact form email (5 per hour per IP)
  router.post('/send', contactFormLimiter, (req: Request, res: Response) =>
    contactController.sendContactEmail(req, res)
  );

  return router;
}

export default createContactRoutes;

