import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { UserService } from "../modules/user/user.service";
import { APIResponse } from "src/common/models/api.model";
import { LoginUserRequest, LoginUserResponse, RegisterUserRequest, RegisterUserResponse } from "src/common/models/user.model";

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
    async login(
        @Body() body: LoginUserRequest
    ): Promise<APIResponse<LoginUserResponse>> {
        const result = await this.userService.login(body);
        return { data: result }
    }

}