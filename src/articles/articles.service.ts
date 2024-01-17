import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma.service';
import { InputArticleDto } from './dtos/input-article.dto';

@Injectable()
export class ArticlesService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return await this.prisma.article.findMany({
			include: { author: true, tags: true },
		});
	}

	async getOne(slug: string) {
		const article = await this.prisma.article.findFirst({
			where: { slug },
			include: { author: true, tags: true },
		});

		if (!article) {
			throw new BadRequestException('Article not found');
		}

		return article;
	}

	async createArticle(dto: InputArticleDto, uuid: string) {
		const slug = slugify(dto.title, { lower: true, strict: true, trim: true });

		const oldArticle = await this.prisma.article.findFirst({
			where: { title: dto.title },
		});

		if (oldArticle) {
			throw new BadRequestException('Article already exists');
		}

		await this.prisma.article.create({
			data: {
				preview: dto.preview,
				title: dto.title,
				content: dto.content,
				slug,
				userUuid: uuid,
				tags: {
					connectOrCreate: dto.tags?.map(tag => ({
						create: { name: tag },
						where: { name: tag },
					})),
				},
			},
			include: { tags: true, author: true },
		});
		return 'Product has been created';
	}

	async updateArticle(slug: string, dto: InputArticleDto, uuid: string) {
		const article = await this.prisma.article.findFirst({
			where: { title: dto.title },
		});

		if (article) {
			throw new BadRequestException('Article not found');
		}

		const newSlug = slugify(dto.title, {
			lower: true,
			strict: true,
			trim: true,
		});

		await this.prisma.article.update({
			where: { slug },
			data: {
				preview: dto.preview,
				title: dto.title,
				content: dto.content,
				slug: newSlug,
				userUuid: uuid,
				tags: {
					connectOrCreate: dto.tags?.map(tag => ({
						create: { name: tag },
						where: { name: tag },
					})),
				},
			},
			include: { tags: true },
		});

		return 'Article has been updated';
	}

	async deleteArticle(slug: string) {
		return await this.prisma.article.delete({ where: { slug } });
	}

	sendImage(img: Express.Multer.File) {
		const path = img.path.replace(/\\/g, '/');
		return {
			path,
		};
	}
}
