import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../database/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService],
    providers: [UserService],
    controllers: [UserController]
})
export default class UserModule { }