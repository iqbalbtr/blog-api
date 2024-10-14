import { Global, Module } from '@nestjs/common';
import { Post } from '../database/entities/post.entity';
import { User } from '../database/entities/user.entity';
import { DataSource } from 'typeorm';
import configuration from '../config/configuration';
import { Comment } from '../database/entities/comment.entity';

@Global()
@Module({
    imports: [],
    providers: [
        {
            provide: DataSource,
            useFactory: async () => {
                try {
                    const dataSource = new DataSource({
                        type: 'mysql',
                        // type: 'sqlite',
                        // database: "./src/database/sqlite.db",
                        host: configuration().database.host,
                        port: +configuration().database.port,
                        username: configuration().database.username,
                        password: configuration().database.password,
                        database: configuration().database.name,
                        synchronize: true,
                        entities: [Post, User, Comment],
                    });
                    await dataSource.initialize();
                    return dataSource;
                } catch (error) {
                    console.log('Error connecting to database');
                    throw error;
                }
            }
        }
    ],
    exports: [DataSource]
})
export class DataBaseModule { }
