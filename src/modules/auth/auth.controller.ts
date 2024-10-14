import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { APIResponse } from "../../common/models/api.model";
import { LoginUserRequest, LoginUserResponse, RegisterUserRequest, RegisterUserResponse } from "../../common/models/user.model";
import { ZodValidation } from "../../common/pipes/validation.pipe";
import { UserValidation } from "../user/user.validation";

@Controller("/auth")
export class AuthController {
    constructor(
        private userService: UserService
    ) { }

    @HttpCode(200)
    @Post("/register")
    async register(
        @Body() body: RegisterUserRequest
    ): Promise<APIResponse<RegisterUserResponse>> {
        const result = await this.userService.register(body);
        return { data: result }
    }


    @HttpCode(200)
    @Post("/login")
    @UsePipes(new ZodValidation(UserValidation.LOGIN))
    async login(
        @Body() body: LoginUserRequest
    ): Promise<APIResponse<LoginUserResponse>> {
        const result = await this.userService.login(body);
        return { data: result }
    }

}