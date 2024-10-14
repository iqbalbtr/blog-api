import { BadRequestException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ValidationService } from "../../providers/validation.service";
import { User } from "../../database/entities/user.entity";
import { LoginUserRequest, LoginUserResponse, RegisterUserRequest, RegisterUserResponse, UpdateUserRequest, UpdateUserResponse } from "../../common/models/user.model";
import { Repository } from "typeorm";
import { UserValidation } from "./user.validation";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { EncryptService } from "../../providers/encrypt.service";
import { UserToken } from "src/common/models/common.model";

@Injectable()
export class UserService {

    constructor(
        private validationService: ValidationService,
        @InjectRepository(User) private userRepository: Repository<User>,
        private JwtService: JwtService,
        private EncryptService: EncryptService
    ) { }

    async register(request: RegisterUserRequest): Promise<RegisterUserResponse> {
        const user: RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER, request);

        const userIsExist = await this.userRepository.count({
            where: {
                username: user.username
            }
        });

        if (userIsExist != 0) {
            throw new HttpException('User already exist', 400);
        }

        const hash = await this.EncryptService.hashPassword(user.password);

        await this.userRepository.save({ ...user, password: hash });

        return {
            username: user.username
        }
    }


    async login(request: LoginUserRequest): Promise<LoginUserResponse> {
        const userExist = await this.userIsExist(request.username)

        if (!userExist) {
            throw new HttpException("User is not found", 404);
        }

        const verify = await this.EncryptService.comparePassword(request.password, userExist.password);

        if (!verify)
            throw new UnauthorizedException({ message: 'Password is wrong' })

        const payload = {
            id: userExist.id,
            username: userExist.username,
            name: userExist.name
        }

        const token = await this.JwtService.signAsync(payload)

        return {
            token
        }
    }

    async update(req: UpdateUserRequest, user: UserToken): Promise<UpdateUserResponse> {

        await this.userIsExist(user.username)        

        await this.userRepository
            .createQueryBuilder()
            .update()
            .set({ name: req.name })
            .where("id = :id", { id: user.id })
            .execute();

        return {
            id: user.id,
            name: req.name,
            username: user.username
        }
    }

    async userIsExist(username: string): Promise<User> {

        const count = await this.userRepository.count({ where: { username } });

        if (count !== 1)
            throw new BadRequestException({ message: 'User is not found' });

        return this.userRepository.findOne({
            where: {
                username
            },
            select: ['id', 'username', 'name', 'password']
        })
    }
}