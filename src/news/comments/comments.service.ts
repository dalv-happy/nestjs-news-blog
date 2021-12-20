import { Injectable } from '@nestjs/common';
import { getRandomInt } from '../news.service';
import { CreateCommentDto } from './dtos/create-comment-dto';

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
  private readonly comments = {};

  create(idNews: number, comment: CreateCommentDto) {
    if (!this.comments[idNews]) {
      this.comments[idNews] = [];
    }

    const newComment = { ...comment, id: getRandomInt() };
    this.comments[idNews].push(newComment);
    return newComment;
  }

  edit(idNews: number, idComment: number, comment: CommentEdit) {
    const indexComment = this.comments[idNews]?.findIndex(
      (c) => c.id === idComment,
    );

    if (!this.comments[idNews] || indexComment === -1) {
      return false;
    }

    this.comments[idNews][indexComment] = {
      ...this.comments[idNews][indexComment],
      ...comment,
    };
    return this.comments[idNews][indexComment];
  }

  find(idNews: number): CreateCommentDto[] | null {
    return this.comments[idNews] || null;
  }

  remove(idNews: number, idComment: number): Comment[] | null {
    if (!this.comments[idNews]) {
      return null;
    }

    const indexComment = this.comments[idNews].findIndex(
      (c) => c.id === idComment,
    );
    if (indexComment === -1) {
      return null;
    }
    return this.comments[idNews].splice(indexComment, 1);
  }
}
