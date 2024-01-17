import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagsService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return await this.prisma.tag.findMany();
	}

	async getOne(id: number) {
		return await this.prisma.tag.findFirst({ where: { id } });
	}
}
