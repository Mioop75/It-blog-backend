import { Controller, Get, Param } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TagDto } from './tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Get()
	async getAll() {
		const tags = await this.tagsService.getAll();
		return plainToInstance(TagDto, tags);
	}

	@Get(':id')
	async getOne(@Param('id') id: number) {
		const tag = await this.tagsService.getOne(id);
		return plainToInstance(TagDto, tag);
	}
}
