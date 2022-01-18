import { Controller, Get, Render, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtCookie } from './auth/jwt.decorator';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(@JwtCookie() jwt): string {
    console.log(jwt);
    return this.appService.getHello();
  }

  @Get()
  @Render('index')
  root() {
    return {
      messages: [{ message: 'Hello', author: 'Vlad' }, { message: 'World' }],
    };
  }
}
