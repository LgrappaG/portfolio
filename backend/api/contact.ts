import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Validate environment variables at startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('Missing EMAIL_USER or EMAIL_PASSWORD environment variables');
}

// Initialize email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    });
    return;
  }

  try {
    const { name, email, subject, message } = req.body as ContactRequest;

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

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid email format',
      } as ApiResponse<null>);
      return;
    }

    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
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

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'rondomman422@gmail.com',
      subject: `Portfolio Contact: ${subject}`,
      html: htmlContent,
      text: `From: ${name}\nEmail: ${email}\n\n${message}`,
      replyTo: email,
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    } as ApiResponse<null>);
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to send email',
    } as ApiResponse<null>);
  }
}
