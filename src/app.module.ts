import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import UserModule from './modules/user/user.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    PostModule,
    CommentModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL })
  }
}
