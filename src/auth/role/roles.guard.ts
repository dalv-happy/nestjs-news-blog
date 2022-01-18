import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const { cookies } = context.switchToHttp().getRequest();
    const { jwt } = cookies;
    const user = await this.authService.verify(jwt);
    // const { headers } = context.switchToHttp().getRequest();
    // const { authorization } = headers;
    // const user = await this.authService.verify(authorization.split(' ')[1]);
    // const user = await this.authService.verify(authorization);
    const _user = await this.usersService.findById(user.id);
    console.log(_user, requiredRoles);

    return requiredRoles.some((role) => _user?.roles === role);
  }
}
