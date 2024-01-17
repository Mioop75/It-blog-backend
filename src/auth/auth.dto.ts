import { PickType } from '@nestjs/swagger';
import { InputUserDto } from '../users/dtos/input-user.dto';

export class AuthDto extends PickType(InputUserDto, [
	'email',
	'name',
	'password',
] as const) {}
