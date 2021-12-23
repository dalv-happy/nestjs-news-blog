import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { NewsEntity } from './news.entity';
import { UsersModule } from '../users/users.module';
import { RolesGuard } from '../auth/role/roles.guard';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    TypeOrmModule.forFeature([NewsEntity]),
    CommentsModule,
    MailModule,
    UsersModule,
  ],
  exports: [TypeOrmModule.forFeature([NewsEntity]), NewsService],
})
export class NewsModule {}
