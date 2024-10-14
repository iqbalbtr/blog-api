import { Body, Controller, Get, HttpCode, Patch, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "../../common/decorators/auth.decorator";
import { UserToken } from "../../common/models/common.model";
import { UpdateUserRequest } from "../../common/models/user.model";
import { UserValidation } from "./user.validation";
import { APIResponse, BasicResponse } from "../../common/models/api.model";
import { ZodValidation } from "../../common/pipes/validation.pipe";

@Controller("/api/user")
export class UserController {
    constructor(
        private userService: UserService,
    ) { }

    @HttpCode(200)
    @Patch()
    @UsePipes(new ZodValidation(UserValidation.UPDATE))
    async update(
        @Body() req: UpdateUserRequest,
        @User() user: UserToken
    ): Promise<APIResponse<BasicResponse>> {
        const result = await this.userService.update(req, user);

        return {
            data: {
                id: result.id
            }
        }
    }
    
    @HttpCode(200)
    @Get("/me")
    async me(
        @User() user: UserToken,
    ): Promise<APIResponse<Partial<UserToken>>> {
        return {
            data:  {
                id: user.id,
                name: user.name,
                username: user.username
            }
        }
    }

}