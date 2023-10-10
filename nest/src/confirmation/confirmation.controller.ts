import { Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('confirm')
@Controller('confirm')
export class ConfirmationController {
  constructor(
    // private readonly authService: AuthService,
    private readonly confirmationService: ConfirmationService,
  ) {}

  @Post('/:email')
  async confirm(@Param('email') email: string) {
    await this.confirmationService.sendEmail(email, 'confirm');
  }

  @Post('/reset/:email')
  async reset(@Param('email') email: string) {
    await this.confirmationService.sendEmail(email, 'reset');
  }
}
