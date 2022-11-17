import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_REQ_KEY } from '.';

const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req[USER_REQ_KEY];
  },
);

export { CurrentUser };
