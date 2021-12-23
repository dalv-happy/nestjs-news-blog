import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { UsersService } from '../../users/users.service';

export type Comment = {
  id?: number;
  message: string;
  author: string;
};

export type CommentEdit = {
  id?: number;
  message?: string;
  author?: string;
};

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly newsService: NewsService,
    private readonly userService: UsersService,
  ) {}
  private readonly comments = {};

  async create(
    idNews: number,
    comment: CreateCommentDto,
  ): Promise<CommentsEntity> {
    const _news = await this.newsService.findById(idNews);
    if (!_news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const _user = await this.userService.findById(comment.userId);
    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Пользователь не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const commentEntity = new CommentsEntity();
    commentEntity.news = _news;
    commentEntity.user = _user;
    commentEntity.message = comment.message;

    return this.commentsRepository.save(commentEntity);
  }

  async edit(idComment: number, comment: CommentEdit): Promise<CommentsEntity> {
    const _comment = await this.commentsRepository.findOne(idComment);
    _comment.message = comment.message;
    return this.commentsRepository.save(_comment);
  }

  async findAll(idNews: number): Promise<CommentsEntity[]> {
    return this.commentsRepository.find({
      where: { news: idNews },
      relations: ['user'],
    });
  }

  async remove(idComment: number): Promise<CommentsEntity> {
    const _comment = await this.commentsRepository.findOne(idComment);
    if (!_comment) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Комментарий не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.commentsRepository.remove(_comment);
  }

  async removeAll(idNews) {
    const _comments = await this.findAll(idNews);
    return await this.commentsRepository.remove(_comments);
  }
}
