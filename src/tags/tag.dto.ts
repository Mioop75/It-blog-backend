import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { ArticleDto } from 'src/articles/dtos/article.dto';

export class TagDto {
	@Expose()
	id: number;
	@Expose()
	@IsString()
	name: string;
	@Expose()
	@Type(() => ArticleDto)
	articles: ArticleDto[];
}
