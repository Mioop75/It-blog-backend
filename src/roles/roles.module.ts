import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RolesService } from './roles.service';

@Module({
	controllers: [],
	providers: [RolesService, PrismaService],
})
export class RolesModule {}
