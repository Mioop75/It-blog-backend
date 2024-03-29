import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
	controllers: [ArticlesController],
	providers: [ArticlesService, PrismaService],
})
export class ArticlesModule {}
