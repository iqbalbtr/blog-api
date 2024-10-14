import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
    })
    head: string;

    @Column({
        type: "varchar",
    })
    sub_head: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP' 
    })
    created_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP' 
    })
    updated_at: Date;

    @Column({
        type: "text",
    })
    body: string;

    @Column({
        type: 'int',
        default: 0
    })
    views: number;

    @ManyToOne(() => User, user => user.posts)
    writer: User;

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[]
}