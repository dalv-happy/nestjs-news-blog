import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  Res,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Render,
} from '@nestjs/common';
import { News, NewsEdit, NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { renderNewsAll } from '../views/news/news-all';
import { renderTemplate } from '../views/template';
import { renderNewsDetail } from '../views/news/news-detail';
import { CreateNewsDto } from './dtos/create-news-dto';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { MailService } from '../mail/mail.service';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService,
  ) {}

  @Get('/api/detail/:id')
  get(@Param('id') id: string): News {
    const idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    const comments = this.commentsService.find(idInt);

    return {
      ...news,
      comments,
    };
  }

  @Get('/api/all')
  getAll(): News[] {
    console.log('getAll');
    const news = this.newsService.getAll();
    return news;
  }

  @Get('/all')
  @Render('news-list')
  getAllView() {
    const news = this.newsService.getAll();

    return { news, title: 'Список новостей!' };
  }

  @Get('create/new')
  @Render('create-news')
  async createView() {
    return {};
  }

  @Get('/detail/:id')
  getDetailView(@Param('id') id: string) {
    const inInt = parseInt(id);
    const news = this.newsService.find(inInt);
    const comments = this.commentsService.find(inInt);

    const content = renderNewsDetail(news, comments);

    return renderTemplate(content, {
      title: news.title,
      description: news.description,
    });
  }

  @Post('/api')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  async create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover,
  ): Promise<News> {
    const fileExtension = cover.originalname.split('.').reverse()[0];
    if (!fileExtension || !fileExtension.match(/(jpg|jpeg|png|gif)$/)) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Неверный формат данных',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }

    const createdNews = this.newsService.create(news);
    await this.mailService.sendNewNewsForAdmins(
      [
        'snezhkinv@yandex.ru',
        'avitshas@gmail.com',
        'alehined@mail.ru',
        'vavilovmn@yandex.ru',
      ],
      createdNews,
    );
    return createdNews;
  }

  @Put('/api/:id')
  edit(@Param('id') id: string, @Body() news: EditNewsDto): News {
    const idInt = parseInt(id);
    return this.newsService.edit(idInt, news);
  }

  @Delete('/api/:id')
  remove(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'Новость удалена' : 'Передан неверный идентификатор';
  }
}
