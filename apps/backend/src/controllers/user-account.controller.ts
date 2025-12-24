import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { UserAccountService } from '../services/user-account.service';

@Controller('api/user-account')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('dob') dob?: string,
  ) {
    await this.userAccountService.signUp(name, email, password, dob);
    return {};
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const { userAccount, tokens } =
      await this.userAccountService.signIn(email, password);

    return {
      user_account: {
        name: userAccount.name,
        email: userAccount.email,
        dob: userAccount.dob
          ? userAccount.dob.toISOString().split('T')[0]
          : null,
      },
      tokens: tokens.map((t) => ({
        type: t.type,
        token: t.token,
        expires_at: t.expires_at,
      })),
    };
  }

  @Get('activate/:code')
  @Redirect()
  async activate(@Param('code') code: string) {
    await this.userAccountService.activate(code);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return {
      url: `${frontendUrl}/sign-in`,
      statusCode: HttpStatus.FOUND,
    };
  }
}
