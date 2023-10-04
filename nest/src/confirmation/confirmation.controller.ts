import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
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
    // let response;
    // try {
    //   response = await this.authService.login(authDto);
    //   await this.confirmationService.sendConfirmationEmail(
    //     authDto.email,
    //     response.access_token,
    //   );
    // } catch (error) {
    //   throw new Error(
    //     `The user registration was not successful.${response.access_token}${error.message}`,
    //   );
    // }
    await this.confirmationService.sendEmail(email, 'confirm');
  }

  @Post('/reset/:email')
  async reset(@Param('email') email: string) {
    await this.confirmationService.sendEmail(email, 'reset');
  }
}
