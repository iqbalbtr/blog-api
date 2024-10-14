import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 55
    })
    name: string;

    @Column({
        type: 'text'
    })
    body: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created_at: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    update_at: number;

    @ManyToOne(() => Post, post => post.comments)
    post: Post

    @ManyToMany(() => User, user => user.likes)
    @JoinTable()
    likes: User[];

    @ManyToOne(() => User, user => user.comments)
    user: User;
}