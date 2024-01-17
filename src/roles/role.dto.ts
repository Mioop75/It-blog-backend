import { Expose } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

export class RoleDto {
	@Expose()
	id: number;
	@Expose()
	name: string;
	users: UserDto[];
}
