import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService, PrismaService],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('Creating user', async () => {
		let user = await service.createUser({
			email: 'test@test.test',
			name: 'test123',
			password: 'test123',
		});
		expect(user).not.toBeNull();
		await service.deleteUser(user.uuid);
	});
});
