import * as nodemailer from 'nodemailer';
import { logger } from '@/utils/logger';
import { escapeHtml } from '@/utils/validators';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendContactEmail(
    senderName: string,
    senderEmail: string,
    subject: string,
    message: string
  ): Promise<void> {
    try {
      // ✅ SECURITY FIX: Escape all user input to prevent HTML/email injection
      const escapedName = escapeHtml(senderName);
      const escapedEmail = escapeHtml(senderEmail);
      const escapedSubject = escapeHtml(subject);
      const escapedMessage = escapeHtml(message);

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #333; border-bottom: 2px solid #f0ad4e; padding-bottom: 10px;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>From:</strong> ${escapedName}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapedEmail}" style="color: #0066cc; text-decoration: none;">${escapedEmail}</a></p>
            <p><strong>Subject:</strong> ${escapedSubject}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6; background-color: #fff; padding: 10px; border-left: 3px solid #f0ad4e;">${escapedMessage}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
            <em>This email was sent from your portfolio contact form. <a href="https://lgrappag.github.io/portfolio/" style="color: #0066cc; text-decoration: none;">Visit portfolio</a></em>
          </p>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'rondomman422@gmail.com',
        subject: `Portfolio Contact: ${escapedSubject}`,
        html: htmlContent,
        // ✅ Plain text version for email clients that don't render HTML
        text: `From: ${escapedName}\nEmail: ${escapedEmail}\nSubject: ${escapedSubject}\n\n${escapedMessage}`,
        replyTo: escapedEmail, // ✅ Safe to use after escaping
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`✅ Email sent from ${senderEmail} to rondomman422@gmail.com`);
    } catch (error) {
      logger.error('❌ Failed to send email:', error);
      throw new Error('Failed to send email. Please try again later.');
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('✅ Email service connected');
      return true;
    } catch (error) {
      logger.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

export function getEmailService(): EmailService {
  return new EmailService();
}
