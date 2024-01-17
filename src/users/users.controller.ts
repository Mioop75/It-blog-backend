import {
	Controller,
	Get,
	Param,
	Patch,
	Put,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/auth/auth.guard';
import { InjectUserInterceptor } from 'src/shared/interceptors/InjectUser.interceptor';
import { UploadFileInterceptor } from 'src/shared/interceptors/upload-file.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './user.decorator';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async getAll() {
		const users = await this.usersService.getAll();
		return plainToInstance(UserDto, users);
	}

	@Get(':name')
	async getOne(@Param('uuid') name: string) {
		const user = await this.usersService.getOne(name);
		return plainToInstance(UserDto, user);
	}

	@Put(':uuid')
	@UseGuards(AuthGuard)
	@UseInterceptors(InjectUserInterceptor)
	async updateUser(
		@Param('uuid') uuid: string,
		dto: Pick<UserDto, 'name' | 'email'>,
	) {
		const user = await this.usersService.updateUser(uuid, dto);
		return plainToInstance(UserDto, user);
	}

	@Patch('change-avatar')
	@UseGuards(AuthGuard)
	@UseInterceptors(
		UploadFileInterceptor('preview', {
			dest: 'uploads/articles/images/[YYYY]/[MM]',
		}),
		InjectUserInterceptor,
	)
	async changeAvatar(
		@CurrentUser('uuid') uuid: string,
		@UploadedFile() img: Express.Multer.File,
	) {
		await this.usersService.changeAvatar(uuid, img);

		return 'Avatar has been changed';
	}
}
