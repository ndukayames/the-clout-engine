import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const authorizationHeader =
      request.headers['X-THE-CLOUT-ACESS-TOKEN'.toLowerCase()];
    if (authorizationHeader) {
      return authorizationHeader;
    }
    return null;
  },
);
