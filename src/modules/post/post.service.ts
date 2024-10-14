import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostRequest, CreatePostResponse, PostQuery } from '../../common/models/post.model';
import { Post, Post as PostEntity } from '../../database/entities/post.entity';
import { ValidationService } from '../../providers/validation.service';
import { Repository } from 'typeorm';
import { UserToken } from '../../common/models/common.model';
import { BasicResponse, PaggingResponse } from '../../common/models/api.model';

/**
 * 
 * The view endpoint from post has not been added
 */
@Injectable()
export class PostService {

    constructor(
        private ValidationService: ValidationService,
        @InjectRepository(PostEntity) private PostRepository: Repository<PostEntity>
    ) { }

    async get(id: number): Promise<PostEntity> {
        const count = await this.PostRepository.count({
            where: {
                id: id
            }
        })

        if (count < 1)
            throw new NotFoundException({ message: 'Post is not found' });

        return this.PostRepository.findOne({
            where: {
                id: id
            },
            relations: {
                writer: true
            },
            select: {
                writer: {
                    id: true,
                    username: true,
                    name: true
                }
            }
        })
    }

    async create(req: CreatePostRequest, user: UserToken): Promise<BasicResponse> {

        const result = await this.PostRepository.save({
            head: req.head,
            sub_head: req.sub_head,
            body: req.body,
            writer: {
                id: user.id
            },
        })

        return {
            id: result.id
        }
    }

    async update(req: CreatePostRequest, id: number, userId: number): Promise<{ id: number }> {

        const postExist = await this.get(id);

        this.ValidationService.mustSameId(postExist.writer.id, userId);

        await this.PostRepository
            .createQueryBuilder()
            .update()
            .set({
                ...req
            })
            .where("id = :id", { id })
            .execute();

        return {
            id
        }
    }

    async remove(id: number, userId: number): Promise<{ id: number }> {

        const postExist = await this.get(id);

        this.ValidationService.mustSameId(postExist.writer.id, userId);

        await this.PostRepository
            .createQueryBuilder()
            .delete()
            .where("id = :id", { id })
            .execute();

        return {
            id
        }
    }

    async list(req: PostQuery): Promise<PaggingResponse<Post>> {

        const skip = (req.page - 1) * req.size;

        const query = this.PostRepository
            .createQueryBuilder('post')
            .leftJoin("post.writer", "writer")
            .select([
                "post.id",
                "post.head",
                "post.sub_head",
                "post.created_at",
                "post.updated_at",
                "post.views",
                "writer.id",
                "writer.username",
                "writer.name",
            ])

        if (req.head) {
            query
                .orWhere('post.sub_head LIKE :sub_head', { sub_head: `%${req.head}%` })
                .where('post.head LIKE :head', { head: `%${req.head}%` })
        }

        if (req.writer) {
            query
                .orWhere('writer.username LIKE :writer', { writer: `%${req.writer}%` })
        }

        const count = await query.clone().getCount();

        const result = await query.clone().skip(skip).take(req.size).getMany()

        Logger.log(result);
        

        return {
            data: result,
            pagging: {
                page: req.page,
                size: req.size,
                count: count,
                total_page: Math.ceil(count / req.size)
            }
        }
    }

    async viewIncreament(id: number): Promise<BasicResponse> {

        const post = await this.get(id);

        this.PostRepository.
            createQueryBuilder()
            .update()
            .where("id = :id", { id })
            .set({
                views: ++post.views
            })

        return {
            id: post.id
        }
    }
}
