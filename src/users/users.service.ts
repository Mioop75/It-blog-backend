import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { InputUserDto } from './dtos/input-user.dto';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return await this.prisma.user.findMany();
	}

	async getOne(name: string) {
		const user = await this.prisma.user.findFirst({ where: { name } });

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	async createUser(dto: InputUserDto, role_id: number = 1) {
		const salt = await genSalt(8);
		const hashedPassword = await hash(dto.password, salt);

		const oldUser = await this.prisma.user.findFirst({
			where: { name: dto.name },
		});

		if (oldUser) {
			throw new BadRequestException('User with this email already exists');
		}

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: dto.name,
				password: hashedPassword,
				role_id,
			},
		});

		return user;
	}

	async updateUser(uuid: string, dto: Pick<UserDto, 'email' | 'name'>) {
		return await this.prisma.user.update({ where: { uuid }, data: { ...dto } });
	}

	async deleteUser(uuid: string) {
		return await this.prisma.user.delete({ where: { uuid } });
	}

	async changeAvatar(uuid: string, avatar: Express.Multer.File) {
		const path = avatar.path.replace(/\\/g, '/');

		return await this.prisma.user.update({
			where: { uuid },
			data: { avatar: path },
		});
	}
}
