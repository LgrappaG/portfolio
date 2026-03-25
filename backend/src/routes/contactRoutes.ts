import { Router, Request, Response } from 'express';
import { ContactController } from '@/controllers/ContactController';
import { EmailService } from '@/services/EmailService';

export function createContactRoutes(): Router {
  const router = Router();
  const emailService = new EmailService();
  const contactController = new ContactController(emailService);

  /**
   * Public Routes
   */

  // POST /api/contact/send - Send contact form email
  router.post('/send', (req: Request, res: Response) =>
    contactController.sendContactEmail(req, res)
  );

  return router;
}

export default createContactRoutes;
