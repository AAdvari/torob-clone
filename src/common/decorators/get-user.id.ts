import {createParamDecorator, ExecutionContext, UnauthorizedException} from '@nestjs/common';

export const GetUserId = createParamDecorator((data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.userId;

});
