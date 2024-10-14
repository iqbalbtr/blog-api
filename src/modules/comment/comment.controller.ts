import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UsePipes } from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from '../../common/decorators/auth.decorator';
import { UserToken } from '../../common/models/common.model';
import { CreateCommentRequest } from '../../common/models/comment.model';
import { ZodValidation } from '../../common/pipes/validation.pipe';
import { CommentValidation } from './comment.validation';
import { APIResponse, BasicResponse, PaggingResponse } from '../../common/models/api.model';
import { Comment } from '../../database/entities/comment.entity';

@Controller('/api/post/:postId/comment')
export class CommentController {

    constructor(
        private CommentService: CommentService,
    ) { }

    @HttpCode(200)
    @Get()
    async get(
        @Param("page", new ParseIntPipe({ optional: true })) page: number,
        @Param("size", new ParseIntPipe({ optional: true })) size: number,
        @Param('postId', new ParseIntPipe({ optional: false })) postId: number
    ): Promise<PaggingResponse<Comment>> {
        const payload = {
            page: page ?? 1,
            size: size ?? 10
        }

        return this.CommentService.list(payload, postId);
    }

    @HttpCode(200)
    @Get("/:commentId/like")
    async like(
        @User() user: UserToken,
        @Param('commentId', new ParseIntPipe({ optional: false })) commentId: number,
        @Param('postId', new ParseIntPipe({ optional: false })) postId: number
    ): Promise<APIResponse<string>> {

        const result = await this.CommentService.like(commentId, postId, user);

        return {
            data: result
        }
    }

    @HttpCode(200)
    @Patch("/:commentId")
    @UsePipes(new ZodValidation(CommentValidation.CREATE))
    async update(
        @Body() body: CreateCommentRequest,
        @User() user: UserToken,
        @Param('commentId', new ParseIntPipe({ optional: false })) commentId: number,
        @Param('postId', new ParseIntPipe({ optional: false })) postId: number
    ): Promise<APIResponse<BasicResponse>> {
        const result = await this.CommentService.update(body, commentId, postId, user);

        return {
            data: result
        }
    }

    @HttpCode(200)
    @Delete(":commentId")
    async remove(
        @User() user: UserToken,
        @Param('commentId', new ParseIntPipe({ optional: false })) commentId: number,
        @Param('postId', new ParseIntPipe({ optional: false })) postId: number
    ): Promise<APIResponse<BasicResponse>> {
        const result = await this.CommentService.remove(commentId, postId, user);

        return {
            data: result
        }
    }

    @HttpCode(200)
    @UsePipes(new ZodValidation(CommentValidation.CREATE))
    @Post()
    async create(
        @User() user: UserToken,
        @Body() body: CreateCommentRequest,
        @Param('postId', new ParseIntPipe({ optional: false })) postId: number
    ): Promise<APIResponse<BasicResponse>> {

        const result = await this.CommentService.create(body, postId, user);

        return {
            data: result
        }
    }
}
