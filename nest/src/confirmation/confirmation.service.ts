import { BadRequestException, Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class ConfirmationService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async sendEmail(email: string, type: string): Promise<void> {
    const user1 = await this.usersService.findByEmail(email);
    if (type === 'confirm' && user1)
      throw new BadRequestException('User already exists');
    if (type === 'reset' && !user1)
      throw new BadRequestException('User Not Found' + email);
    const payload = { email: email };
    const token = this.jwtService.sign(payload);
    const transporter = nodemailer.createTransport({
      service: 'yahoo',
      auth: {
        user: this.configService.get('YAHOO_MAIL'),
        pass: this.configService.get('YAHOO_PASS'),
      },
    });
    const subject =
      type === 'confirm' ? 'Confirm Your Email Address' : 'Reset password';
    const message =
      type === 'confirm'
        ? `Click the following button to confirm your email: <button><a href="http://localhost:3000/confirm/${token}">Confirm</a></button>`
        : `Click the following button to reset your password: <button><a href="http://localhost:3000/auth/reset-password/${token}">RESET</a></button>`;

    const mailOptions = {
      from: 'gavra.anamaria@yahoo.com', // Replace with your email address
      to: [email],
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
  }
}
