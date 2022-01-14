import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Role } from '../../auth/role/role.enum';

export class EditUserDto {
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.firstName)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.email)
  email: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.password)
  password: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.roles)
  roles: Role;
}
