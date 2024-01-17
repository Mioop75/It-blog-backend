import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ArticleDto } from 'src/articles/dtos/article.dto';
import { RoleDto } from 'src/roles/role.dto';

export class UserDto {
	@Expose()
	uuid: string;
	@Expose()
	@IsOptional()
	@IsString()
	avatar?: string;
	@Expose()
	@IsString()
	@IsEmail()
	@ApiProperty()
	email: string;
	@Expose()
	@IsString()
	@ApiProperty()
	name: string;
	@Expose()
	@Type(() => RoleDto)
	role: RoleDto;
	@Expose()
	@Type(() => ArticleDto)
	articles: ArticleDto[];
	@Expose()
	createdAt: Date;
	@Expose()
	updatedAt: Date;
}
