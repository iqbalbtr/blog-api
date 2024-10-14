import { Post } from "../database/entities/post.entity";
import { User } from "../database/entities/user.entity";
import { DataSource } from "typeorm";
import { Comment } from "./entities/comment.entity";
import configuration from '../config/configuration';

export default new DataSource({
    type: 'mysql',
    // type: 'sqlite',
    // database: "./src/database/sqlite.db",
    host: configuration().database.host,
    port: +configuration().database.port,
    username: configuration().database.username,
    password: configuration().database.password,
    database: configuration().database.name,
    synchronize: false,
    entities: [Post, User, Comment],
    migrations: [`./src/database/migrations/*{.ts,.js}`]
});

