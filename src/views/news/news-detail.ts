import { News } from '../../news/news.service';
import { Comment } from '../../news/comments/comments.service';
import { CreateCommentDto } from '../../news/comments/dtos/create-comment-dto';

export function renderNewsDetail(
  news: News,
  comment: CreateCommentDto[],
): string {
  return `
    <div class="container">
      <img src="http://localhost:3000/${news.cover}" alt="">
      <h1>${news.title}</h1>
      <div>${news.description}</div>
      <div class="text-muted">Автор: ${news.author}</div>
      
      ${comment ? renderNewsComments(comment) : 'Нет комментариев'}
    </div>
`;
}

function renderNewsComments(comments: CreateCommentDto[]): string {
  let html = '';
  for (const comment of comments) {
    html += `
    <div class="row">
      <div class="col-lg-1">
        ${
          comment?.avatar
            ? `<img src="http://localhost:3000/${comment.avatar}" style="background: #ccc; width: 75px; height: 75px; object-fit: cover;"/>`
            : '<div style="background: #ccc; width: 75px; height: 75px; overflow: hidden;" class="rounded-lg"></div>'
        }
        
      </div>
      <div class="col-lg-8">
        <div>${comment.author}</div>
        <div>${comment.message}</div>
      </div>
    </div>
    `;
  }
  return html;
}
