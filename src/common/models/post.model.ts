import { ListQuery } from "./api.model";

export class CreatePostRequest {
    head: string;
    sub_head: string;
    body: string;
}

export class CreatePostResponse {
    id: number;
    head: string;
    sub_head: string;
    body: string;
    created_at: Date;
    updated_at: Date;
}

export class PostQuery extends ListQuery {
    head: string;
    writer: string;
}