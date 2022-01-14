import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsModule } from '../news.module';
import { UsersModule } from '../../users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsEntity } from './comments.entity';
import { SocketCommentsGateway } from './socket-comments.gateway';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    forwardRef(() => NewsModule),
    UsersModule,
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, SocketCommentsGateway],
  exports: [CommentsService, TypeOrmModule.forFeature([CommentsEntity])],
})
export class CommentsModule {}
