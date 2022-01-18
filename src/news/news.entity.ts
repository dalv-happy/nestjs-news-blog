import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { CommentsEntity } from './comments/comments.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('news')
export class NewsEntity {
  @ApiProperty({
    example: 1,
    description: 'Идентификатор новости',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Новость про котов',
    description: 'Заголовок новости',
  })
  @Column('text')
  title: string;

  @ApiProperty({
    example: 'Коты классные и милые...',
    description: 'Описание новости',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    example:
      'http://localhost:3000/news-static/bebbcfe4-e111-406b-8653-9840bfcb561c.PNG',
    description: 'Обложка новости',
  })
  @Column('text', { nullable: true })
  cover: string;

  @ManyToOne(() => UsersEntity, (user) => user.news)
  user: UsersEntity;

  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  comments: CommentsEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
