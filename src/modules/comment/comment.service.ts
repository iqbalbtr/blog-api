import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from '../../common/models/common.model';
import { Comment } from '../../database/entities/comment.entity';
import { ValidationService } from '../../providers/validation.service';
import { Repository } from 'typeorm';
import { PostService } from '../post/post.service';
import { BasicResponse, ListQuery, PaggingResponse } from '../../common/models/api.model';
import { CreateCommentRequest } from '../../common/models/comment.model';

/**
 * 
 * The number of likes from comments has not been added
 */

@Injectable()
export class CommentService {

    constructor(
        private ValidationService: ValidationService,
        private PostService: PostService,
        @InjectRepository(Comment) private CommentRepository: Repository<Comment>
    ) { }

    async commentIsExist(id: number): Promise<Comment> {

        const comment = await this.CommentRepository.findOne({ where: { id: id }, relations: { user: true } });

        if (!comment)
            throw new NotFoundException({ message: "Comment is not found" });

        return comment
    }

    async update(req: CreateCommentRequest, id: number, postId: number, user: UserToken): Promise<BasicResponse> {

        await this.PostService.get(postId);

        const existComment = await this.commentIsExist(id);

        this.ValidationService.mustSameId(existComment.user.id, user.id)

        await this.CommentRepository.
            createQueryBuilder()
            .update(Comment)
            .set({
                body: req.body,
                update_at: () => "CURRENT_TIMESTAMP"
            })
            .where("id = :id", { id })
            .execute();

        return {
            id
        }
    }

    async remove(id: number, postId: number, user: UserToken): Promise<BasicResponse> {

        await this.PostService.get(postId)

        const existComment = await this.commentIsExist(id);

        this.ValidationService.mustSameId(existComment.user.id, user.id)

        await this.CommentRepository.
            createQueryBuilder()
            .delete()
            .from(Comment)
            .where("id = :id", { id })
            .execute();

        return {
            id
        }
    }

    async create(req: CreateCommentRequest, postId: number, user: UserToken): Promise<BasicResponse> {

        await this.PostService.get(postId)

        const result = await this.CommentRepository.save({
            body: req.body,
            name: user.name,
            user: {
                id: user.id
            },
            post: {
                id: postId
            }
        })

        return {
            id: result.id
        }
    }

    async list(req: ListQuery, postId: number): Promise<PaggingResponse<Comment>> {

        const skip = (req.page - 1) * req.size;

        await this.PostService.get(postId);

        const query = this.CommentRepository
            .createQueryBuilder("comment")
            .leftJoin("comment.user", "user")
            .leftJoin("comment.post", "post")
            .select()
            .where("post.id = :postId", { postId })

        const count = await query.getCount();
        const result = await query.skip(skip).limit(req.size).getMany();

        return {
            data: result,
            pagging: {
                page: req.page,
                total_page: Math.ceil(count / req.size),
                size: req.size,
                count
            }
        }
    }

    async like(commentId: number, postId: number, user: UserToken) {

        await this.PostService.get(postId)

        const isLiked = await this.CommentRepository
            .createQueryBuilder("comment")
            .leftJoin("comment.likes", "user")
            .where("comment.id = :commentId", { commentId })
            .andWhere("user.id = :userId", { userId: user.id })
            .getCount();

        if (isLiked === 0) {
            await this.CommentRepository
                .createQueryBuilder()
                .relation(Comment, "likes")
                .of(commentId)
                .add(user.id);

            return "added";
        } else {
            await this.CommentRepository
                .createQueryBuilder()
                .relation(Comment, "likes")
                .of(commentId)
                .remove(user.id);

            return "deleted";
        }
    }
}
