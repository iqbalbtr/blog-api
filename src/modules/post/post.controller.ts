import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostRequest, CreatePostResponse } from '../../common/models/post.model';
import { APIResponse, BasicResponse, PaggingResponse } from '../../common/models/api.model';
import { User } from '../../common/decorators/auth.decorator';
import { UserToken } from '../../common/models/common.model';
import { Post as PostEntity } from '../../database/entities/post.entity';
import { ZodValidation } from '../../common/pipes/validation.pipe';
import { PostValidation } from './post.validation';


@Controller('/api/post')
export class PostController {

    constructor(
        private PostService: PostService,
    ) { }

    @HttpCode(200)
    @Post()
    @UsePipes(new ZodValidation(PostValidation.CREATE))
    async create(
        @Body() req: CreatePostRequest,
        @User() user: UserToken
    ): Promise<APIResponse<BasicResponse>> {
        const result = await this.PostService.create(req, user);

        return {
            data: result
        }
    }

    @HttpCode(200)
    @Get("/:postId")
    async get(
        @Param("postId", ParseIntPipe)  postId: number
    ): Promise<APIResponse<PostEntity>> {

        const result = await this.PostService.get(postId)

        return {
            data: result
        }
    }

    @HttpCode(200)
    @Patch("/:postId")
    @UsePipes(new ZodValidation(PostValidation.CREATE))
    async update(
        @User() user: UserToken,
        @Body() body: CreatePostRequest,
        @Param("postId")  postId: number
    ): Promise<APIResponse<any>> {
        const result = await this.PostService.update(body, postId, user.id)

        return {
            data: result
        }
    }

    @HttpCode(200)
    @Delete("/:postId")
    async remove(
        @User() user: UserToken,
        @Param("postId", ParseIntPipe) postId: number
    ): Promise<APIResponse<BasicResponse>> {

        const result = await this.PostService.remove(postId, user.id)

        return {
            data: result
        }
    }

    @HttpCode(200)
    @Get("/:postId/view")
    async views(
        @Param("postId", ParseIntPipe) postId: number
    ): Promise<APIResponse<BasicResponse>> {

        const result = await this.PostService.viewIncreament(postId)

        return {
            data: result
        }
    }

    @HttpCode(200)
    @Get()
    async list(
        @Param("page", new ParseIntPipe({ optional: true })) page: number,
        @Param("size", new ParseIntPipe({ optional: true })) size: number,
        @Query("writer") writer?: string,
        @Query("head") head?: string
    ): Promise<PaggingResponse<PostEntity>> {
        const payload = {
            head,
            writer,
            page: page ?? 1,
            size: size ?? 8
        };

        return this.PostService.list(payload);
    }
}
