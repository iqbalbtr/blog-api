import { z } from "zod";

export class CommentValidation {
    static readonly CREATE = z.object({
        body: z.string().min(1)
    })
}