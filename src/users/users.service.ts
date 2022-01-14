import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { CreateUserDto } from './dtos/create-user-dto';
import { hash } from '../utils/crypto';
import { EditUserDto } from './dtos/edit-user-dto';
import { checkPermission, Modules } from '../auth/role/utils/check-permission';
import { Role } from '../auth/role/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async create(user: CreateUserDto) {
    const userEntity = new UsersEntity();
    userEntity.firstName = user.firstName;
    userEntity.email = user.email;
    userEntity.roles = Role.User;
    userEntity.password = await hash(user.password);

    return this.usersRepository.save(userEntity);
  }

  async edit(id: number, user: EditUserDto) {
    const _user = await this.findById(id);
    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Неверный идентификатор пользователя',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    _user.firstName = user.firstName || _user.firstName;
    _user.email = user.email || _user.email;

    if (checkPermission(Modules.changeRole, _user.roles)) {
      _user.roles = user.roles || _user.roles;
    }
    _user.password = (await hash(user.password)) || _user.password;

    return this.usersRepository.save(_user);
  }

  async findById(id: number): Promise<UsersEntity> {
    return this.usersRepository.findOne(id);
  }

  async findByEmail(email): Promise<UsersEntity> {
    return await this.usersRepository.findOne({ email });
  }
}
