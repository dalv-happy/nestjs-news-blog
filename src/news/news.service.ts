import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comments/comments.service';
import { NewsEntity } from './news.entity';
import { CreateNewsDto } from './dtos/create-news-dto';
import { UsersService } from '../users/users.service';

export interface News {
  id?: number;
  title: string;
  description: string;
  author: string;
  countView?: number;
  cover?: string;
  comments?: Comment[];
}

export interface NewsEdit {
  title?: string;
  description?: string;
  author?: string;
  countView?: number;
  cover?: string;
}

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
    private usersService: UsersService,
  ) {}

  async create(news: CreateNewsDto): Promise<NewsEntity> {
    const newsEntity = new NewsEntity();
    newsEntity.title = news.title;
    newsEntity.description = news.description;
    newsEntity.cover = news.cover;
    const _user = await this.usersService.findById(parseInt(news.userId));
    newsEntity.user = _user;
    return this.newsRepository.save(newsEntity);
  }

  findById(id: News['id']): Promise<NewsEntity> {
    return this.newsRepository.findOne({ id }, { relations: ['user'] });
  }

  getAll(): Promise<NewsEntity[]> {
    return this.newsRepository.find({});
  }

  async edit(id: number, news: NewsEdit): Promise<NewsEntity | null> {
    const editableNews = await this.findById(id);
    if (editableNews) {
      const newsEntity = new NewsEntity();
      newsEntity.title = news.title || editableNews.title;
      newsEntity.description = news.description || editableNews.description;
      newsEntity.cover = news.cover || editableNews.cover;

      return this.newsRepository.save(newsEntity);
    }
    return null;
  }

  async remove(id): Promise<NewsEntity | null> {
    const removeNews = await this.findById(id);
    if (removeNews) {
      return this.newsRepository.remove(removeNews);
    }
    return null;
  }
}
