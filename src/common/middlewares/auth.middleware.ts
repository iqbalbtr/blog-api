import { Injectable, Logger, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { UserService } from "../../modules/user/user.service";
import { UserToken } from "../models/common.model";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    private logger = new Logger()

    constructor(
        private userService: UserService,
        private jwtServie: JwtService
    ) { }

    async use(req: Request & { user?: UserToken }, res: Response, next: NextFunction) {

        const token = req.headers['authorization'];

        if (!token)
            throw new UnauthorizedException();

        try {
            const decodeToken: UserToken = await this.jwtServie.verifyAsync(token.split(' ')[1]);

            await this.userService.userIsExist(decodeToken.username);            

            req['user'] = decodeToken;

            next();
        } catch (error: any) {
            throw new UnauthorizedException({ message: 'Token is invalid' });
        }
    }
}