import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'localhost',
      port: parseInt(process.env.MAIL_PORT || '1025'),
      secure: false,
      auth:
        process.env.MAIL_USER
          ? {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
            }
          : undefined,
    });
  }

  async sendActivationEmail(
    email: string,
    name: string,
    activationLink: string,
  ): Promise<void> {
    const appName = process.env.APP_NAME || 'Finsinghts';

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || 'noreply@finsinghts.com',
      to: email,
      subject: `Welcome to ${appName} - Activate Your Account`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to ${appName}, ${name}!</h1>
            <p>Thank you for signing up. To complete your registration, please activate your account by clicking the button below:</p>
            <a href="${activationLink}" class="button">Activate Account</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${activationLink}</p>
            <p><strong>This link will expire in 7 days.</strong></p>
            <div class="footer">
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to ${appName}, ${name}!

        Thank you for signing up. To complete your registration, please activate your account by clicking the link below:

        ${activationLink}

        This link will expire in 7 days.

        If you didn't create this account, please ignore this email.
      `,
    });
  }
}
