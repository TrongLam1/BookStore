import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@/entities/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async mailActivationAccount(user: User) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Active account',
      template: 'register.hbs',
      context: {
        name: user?.username ?? user.email,
        activationCode: user.code
      }
    });
  }
}
