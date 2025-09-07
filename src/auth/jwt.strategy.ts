import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserForToken } from './interfaces/user-for-token.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private config: ConfigService,
		private prisma: PrismaService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
		});
	}

	async validate(payload: { sub: number }): Promise<UserForToken | null> {
		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
		});
		if (!user) return null;
		return { id: user.id };
	}
}
