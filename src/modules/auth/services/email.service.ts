// src/modules/auth/services/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Configure the email transporter (use Gmail or any SMTP service)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',  // You can use other SMTP services like SendGrid, Mailgun, etc.
      auth: {
        user: process.env.AUTH_EMAIL || 'dev2.binatedigital@gmail.com',  // Email address
        pass: process.env.AUTH_PASSWORD || 'opfsrjovmgulnylz',  // Email password
      },
    });
  }

  // Function to send OTP email
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code for Signup',
      text: `Your OTP code is: ${otp}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Function to send OTP email
  async sendForgotOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Forgot Password OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
