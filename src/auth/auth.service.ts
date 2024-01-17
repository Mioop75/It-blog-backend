import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { v4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly usersService: UsersService,
	) {}

	async register(dto: AuthDto) {
		const user = await this.usersService.createUser(dto, 1);
		const date = new Date();
		date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1e3);

		const session = await this.prisma.user_Sessions.create({
			data: { sid: v4(), user_uuid: user.uuid },
		});
		return { user, sid: session.sid };
	}

	async login(dto: Pick<AuthDto, 'name' | 'password'>) {
		const user = await this.usersService.getOne(dto.name);

		const verifiedPassword = await compare(dto.password, user.password);

		if (!verifiedPassword) {
			throw new UnauthorizedException('Wrong password');
		}

		const date = new Date();
		date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1e3);

		const session = await this.prisma.user_Sessions.create({
			data: { sid: v4(), user_uuid: user.uuid },
		});

		return { user, sid: session.sid };
	}

	async logout(sid: string) {
		await this.prisma.user_Sessions.delete({ where: { sid } });
		return 'Session was deleted';
	}

	async getMe(sid: string) {
		const session = await this.prisma.user_Sessions.findFirst({
			where: { sid },
			include: { user: { include: { role: true } } },
		});

		return { user: session.user };
	}
}
