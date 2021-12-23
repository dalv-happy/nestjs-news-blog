import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { EditCommentDto } from './dtos/edit-comment-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { HelperFileLoader } from '../../utils/HelperFileLoader';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/api/:idNews')
  create(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() comment: CreateCommentDto,
  ) {
    return this.commentsService.create(idNews, comment);
  }

  @Put('/api/:idComment')
  edit(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Body() comment: EditCommentDto,
  ) {
    return this.commentsService.edit(idComment, comment);
  }

  @Get('/api/details/:idNews')
  get(@Param('idNews', ParseIntPipe) idNews: number) {
    return this.commentsService.findAll(idNews);
  }

  @Delete('/api/details/:idNews/:idComment')
  remove(@Param('idComment', ParseIntPipe) idComment: number) {
    return this.commentsService.remove(idComment);
  }
}
