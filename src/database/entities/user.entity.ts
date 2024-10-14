import { Column, Entity,  ManyToMany,  OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { Comment } from "./comment.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        unique: true
    })
    username: string;

    @Column({
        type: 'varchar',
    })
    password: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @OneToMany(() => Post, post => post.writer)
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    @ManyToMany(() => Comment, comment => comment.likes)
    likes: Comment[]
}

