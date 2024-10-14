import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";
import { UserToken } from "../models/common.model";

export class ZodValidation implements PipeTransform {

    constructor(
        private schema: ZodSchema
    ) { }

    transform(value: any, metadata: ArgumentMetadata) {     

        
        if(['param', 'query', 'custom'].includes(metadata.type))
            return value
        
        
        try {
            const parse = this.schema.parse(value);
            return parse
        } catch (error) {            
            throw new BadRequestException({ message: "Validation error" })
        }
    }
}