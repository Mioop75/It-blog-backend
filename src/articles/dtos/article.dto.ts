import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { TagDto } from 'src/tags/tag.dto';
import { UserDto } from 'src/users/dtos/user.dto';

export class ArticleDto {
	@Expose()
	uuid: string;
	@Expose()
	@IsString()
	preview: string;
	@Expose()
	@IsString()
	title: string;
	@Expose()
	slug: string;
	@Expose()
	@IsString()
	content: string;
	@Expose()
	@Type(() => UserDto)
	author: UserDto;
	@Expose()
	@Type(() => TagDto)
	tags: TagDto[];
	@Expose()
	createdAt: Date;
}
