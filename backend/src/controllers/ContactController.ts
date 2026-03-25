import { Request, Response } from 'express';
import { EmailService } from '@/services/EmailService';
import { logger } from '@/utils/logger';
import { ApiResponse } from '@/types';

export class ContactController {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }

  /**
   * POST /api/contact/send
   * Send contact form email
   */
  async sendContactEmail(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, subject, message } = req.body;

      // Validation
      if (!name?.trim()) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Name is required',
        } as ApiResponse<null>);
        return;
      }

      if (!email?.trim()) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Email is required',
        } as ApiResponse<null>);
        return;
      }

      if (!subject?.trim()) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Subject is required',
        } as ApiResponse<null>);
        return;
      }

      if (!message?.trim()) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Message is required',
        } as ApiResponse<null>);
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Invalid email format',
        } as ApiResponse<null>);
        return;
      }

      // Send email
      await this.emailService.sendContactEmail(
        name.trim(),
        email.trim(),
        subject.trim(),
        message.trim()
      );

      res.status(200).json({
        success: true,
        data: null,
        message: 'Email sent successfully',
      } as ApiResponse<null>);
    } catch (error) {
      logger.error('Contact email error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to send email',
      } as ApiResponse<null>);
    }
  }
}
