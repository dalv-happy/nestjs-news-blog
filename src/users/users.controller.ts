import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Get,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersService } from './users.service';
import { EditUserDto } from './dtos/edit-user-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('api')
  async create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Get('edit-profile/:id')
  @Render('user/edit-profile')
  async renderEditProfile(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const _user = await this.usersService.findById(id);
    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Неверный идентификатор пользователя',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return _user;
  }

  @Patch('api')
  @UseGuards(JwtAuthGuard)
  async edit(@Body() user: EditUserDto, @Req() req) {
    const jwtUserId = req.user.userId;
    return this.usersService.edit(jwtUserId, user);
  }
}
