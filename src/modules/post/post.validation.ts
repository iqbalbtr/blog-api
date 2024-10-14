import { ZodType, z } from "zod";

export class PostValidation {
    
    static readonly CREATE: ZodType = z.object({
        head: z.string().min(1).max(55),
        sub_head: z.string().min(1).max(55),
        body: z.string().min(1)
    });
}