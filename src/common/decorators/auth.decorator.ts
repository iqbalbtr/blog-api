import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { UserToken } from "../models/common.model";

export const User = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): UserToken => {
        const req = ctx.switchToHttp().getRequest();
        if (req['user']) {

            return req['user'];
        } else {
            throw new UnauthorizedException();
        }
    }
)