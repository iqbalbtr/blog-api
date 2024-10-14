import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ZodType } from "zod";

@Injectable()
export class ValidationService {

    validate<T>(zodType: ZodType<T>, data: T): T {
        try {
            return zodType.parse(data)
        } catch (error) {
            throw new BadRequestException({ message: "Validation error" })
        }
    }

    mustSameId(id: number, idUser: number): boolean {

        if (id !== idUser)
            throw new UnauthorizedException({message: "Opeartion rejected"});

        return true
    }
}