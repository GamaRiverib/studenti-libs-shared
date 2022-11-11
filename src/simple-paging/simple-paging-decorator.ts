import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { SimplePaging } from "./simple-paging";

const QuerySimplePaging = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return SimplePaging.getInstance({
    cursor: req.query.cursor,
    offset: req.query.offset,
    limit: req.query.limit,
    sort: req.query.sort,
    direction: req.query.direction,
  });
});

export { QuerySimplePaging };