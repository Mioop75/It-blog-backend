import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/auth/auth.guard';
import { ImageDto } from 'src/shared/dtos/image.dto';
import { InjectUserInterceptor } from 'src/shared/interceptors/InjectUser.interceptor';
import { UploadFileInterceptor } from 'src/shared/interceptors/upload-file.interceptor';
import { CurrentUser } from 'src/users/user.decorator';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dtos/article.dto';
import { InputArticleDto } from './dtos/input-article.dto';

@Controller('articles')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	async getAll() {
		const articles = await this.articlesService.getAll();

		return plainToInstance(ArticleDto, articles);
	}

	@Get(':slug')
	async getOne(@Param('slug') slug: string) {
		const article = await this.articlesService.getOne(slug);
		return plainToInstance(ArticleDto, article);
	}

	@Post()
	@UseGuards(AuthGuard)
	@UseInterceptors(InjectUserInterceptor)
	async createArticle(
		@Body() dto: InputArticleDto,
		@CurrentUser('uuid') uuid: string,
	) {
		await this.articlesService.createArticle(dto, uuid);
		return 'Article has been created';
	}

	@Put(':slug')
	async updateArticle(
		@Param('slug') slug: string,
		@Body() dto: InputArticleDto,
		@CurrentUser('uuid') uuid: string,
	) {
		await this.articlesService.updateArticle(slug, dto, uuid);
		return 'Article has been updated';
	}

	@Delete(':slug')
	async deleteArticle(@Param('slug') slug: string) {
		await this.articlesService.deleteArticle(slug);
		return 'Article has been deleted';
	}

	@Post('send-image')
	@UseInterceptors(
		UploadFileInterceptor('preview', {
			dest: 'uploads/articles/images/[YYYY]/[MM]',
		}),
	)
	@UseGuards(AuthGuard)
	sendImage(@UploadedFile() img: Express.Multer.File) {
		const image = this.articlesService.sendImage(img);

		return plainToInstance(ImageDto, image);
	}
}
