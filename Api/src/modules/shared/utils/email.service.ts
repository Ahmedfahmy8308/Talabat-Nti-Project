import nodemailer from 'nodemailer';
import { IEmailConfig } from '../interfaces';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(config: IEmailConfig): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: config.to,
        subject: config.subject,
        html: this.getEmailTemplate(config.template, config.data)
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${config.to}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendOTPEmail(email: string, otp: string, purpose: 'verification' | 'reset'): Promise<void> {
    const subject = purpose === 'verification' 
      ? 'Verify Your Email - Talabat' 
      : 'Reset Your Password - Talabat';

    await this.sendEmail({
      to: email,
      subject,
      template: 'otp',
      data: { otp, purpose }
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Welcome to Talabat!',
      template: 'welcome',
      data: { name }
    });
  }

  async sendOrderConfirmationEmail(
    email: string, 
    orderNumber: string, 
    customerName: string
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      template: 'order-confirmation',
      data: { orderNumber, customerName }
    });
  }

  async sendRestaurantApprovalEmail(email: string, restaurantName: string, status: 'approved' | 'rejected'): Promise<void> {
    const subject = status === 'approved' 
      ? 'Restaurant Application Approved!' 
      : 'Restaurant Application Update';

    await this.sendEmail({
      to: email,
      subject,
      template: 'restaurant-approval',
      data: { restaurantName, status }
    });
  }

  private getEmailTemplate(template: string, data?: Record<string, any>): string {
    const templates = {
      otp: this.getOTPTemplate(data?.otp, data?.purpose),
      welcome: this.getWelcomeTemplate(data?.name),
      'order-confirmation': this.getOrderConfirmationTemplate(data?.orderNumber, data?.customerName),
      'restaurant-approval': this.getRestaurantApprovalTemplate(data?.restaurantName, data?.status)
    };

    return templates[template as keyof typeof templates] || '';
  }

  private getOTPTemplate(otp: string, purpose: string): string {
    const title = purpose === 'verification' ? 'Verify Your Email' : 'Reset Your Password';
    const message = purpose === 'verification' 
      ? 'Please use the following OTP to verify your email address:'
      : 'Please use the following OTP to reset your password:';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .otp-code { background-color: #007bff; color: white; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Talabat</h1>
            <h2>${title}</h2>
          </div>
          <p>Hello,</p>
          <p>${message}</p>
          <div class="otp-code">${otp}</div>
          <p>This OTP will expire in 10 minutes for security reasons.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Talabat. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Talabat</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .welcome-message { background-color: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Talabat!</h1>
          </div>
          <div class="welcome-message">
            <h2>Hello ${name},</h2>
            <p>Welcome to the Talabat family! We're excited to have you on board.</p>
            <p>You can now browse restaurants, order your favorite meals, and enjoy fast delivery.</p>
          </div>
          <p>Start exploring amazing restaurants and delicious food right now!</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Talabat. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getOrderConfirmationTemplate(orderNumber: string, customerName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .order-info { background-color: #d1ecf1; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
          </div>
          <div class="order-info">
            <h2>Thank you, ${customerName}!</h2>
            <p>Your order has been confirmed and is being prepared.</p>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
          </div>
          <p>You'll receive updates about your order status via email.</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Talabat. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getRestaurantApprovalTemplate(restaurantName: string, status: 'approved' | 'rejected'): string {
    const isApproved = status === 'approved';
    const title = isApproved ? 'Restaurant Application Approved!' : 'Restaurant Application Update';
    const message = isApproved 
      ? `Congratulations! Your restaurant "${restaurantName}" has been approved and is now live on Talabat.`
      : `Unfortunately, your restaurant application for "${restaurantName}" has been rejected. Please contact support for more information.`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .status-message { padding: 20px; border-radius: 5px; margin: 20px 0; }
          .approved { background-color: #d4edda; }
          .rejected { background-color: #f8d7da; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="status-message ${isApproved ? 'approved' : 'rejected'}">
            <p>${message}</p>
          </div>
          ${isApproved ? '<p>You can now start receiving orders and managing your restaurant through the dashboard.</p>' : ''}
          <div class="footer">
            <p>© ${new Date().getFullYear()} Talabat. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
