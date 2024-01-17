import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
	constructor(private readonly prisma: PrismaService) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest<Request>();

		const sid = request.signedCookies['sid'];
		const session = sid
			? await this.prisma.user_Sessions.findFirst({ where: { sid } })
			: null;

		const user = sid
			? await this.prisma.user.findFirst({
					where: { uuid: session.user_uuid },
				})
			: null;

		if (user) {
			request.user = user;
		}

		return next.handle();
	}
}
