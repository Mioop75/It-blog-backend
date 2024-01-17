import { PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { ArticleDto } from './article.dto';

export class InputArticleDto extends PickType(ArticleDto, [
	'preview',
	'title',
	'content',
]) {
	@IsArray()
	tags: string[];
}
