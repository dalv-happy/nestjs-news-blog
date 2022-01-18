import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as cookieParser from 'cookie-parser';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const client = context.switchToWs().getClient();
      // const authToken: string =
      //   client.handshake.headers.authorization.split(' ')[1];
      const cookies: string[] = client.handshake.headers.cookie.split('; ');
      const jwt = cookies.find((c) => !c.indexOf('jwt')).split('=')[1];
      console.log(jwt);
      const isAuth = await this.authService.verify(jwt);
      if (isAuth) {
        const user = await this.authService.decode(jwt);
        console.log(user);
        context.switchToWs().getClient().data.user = user;
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }
}
