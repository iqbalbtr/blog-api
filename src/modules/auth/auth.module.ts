import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import UserModule from "../../modules/user/user.module";

@Module({
    controllers: [AuthController],
    imports: [UserModule],
})

export class AuthModule {}