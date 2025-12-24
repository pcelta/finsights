import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAccount } from '../entities/user-account.entity';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserAccount => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
