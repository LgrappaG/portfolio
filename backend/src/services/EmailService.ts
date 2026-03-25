import * as nodemailer from 'nodemailer';
import { logger } from '@/utils/logger';

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
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>From:</strong> ${senderName}</p>
            <p><strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'rondomman422@gmail.com',
        subject: `Portfolio Contact: ${subject}`,
        html: htmlContent,
        text: `From: ${senderName}\nEmail: ${senderEmail}\n\n${message}`,
        replyTo: senderEmail,
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
