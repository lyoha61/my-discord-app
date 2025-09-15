import {
	Controller,
	HttpCode,
	HttpStatus,
	Logger,
	Post,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { Body } from '@nestjs/common';
import RegisterUserDto from './dto/register-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import LoginUserDto from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserForToken } from './interfaces/user-for-token.interface';
import { ConfigService } from '@nestjs/config';
import { User as UserDecorator } from 'src/common/decorators/user.decorator';
import { RefreshTokenService } from './refresh-token.service';
import { UserService } from 'src/user/user.service';
import { RefreshAccessTokenResponse, TokensResponse } from 'shared/types/auth';
import ms, { StringValue } from 'ms';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
	private readonly accessTokenExpires: ms.StringValue;
	private readonly refreshTokenExpires: ms.StringValue;
	private readonly REFRESH_SECRET: string;

	private readonly logger = new Logger(AuthController.name);

	constructor(
		private prisma: PrismaService,
		private refreshTokenService: RefreshTokenService,
		private jwtService: JwtService,
		private configService: ConfigService,
		private readonly userService: UserService,
	) {
		this.accessTokenExpires = this.configService.getOrThrow<ms.StringValue>(
			'ACCESS_TOKEN_EXPIRES_IN',
		);
		this.refreshTokenExpires = this.configService.getOrThrow<ms.StringValue>(
			'REFRESH_TOKEN_EXPIRES_IN',
		);
		this.REFRESH_SECRET =
			this.configService.getOrThrow<StringValue>('JWT_SECRET');
	}

	private async hashPassword(password: string): Promise<string> {
		const saltRounds = 10;
		const hashedPass = await bcrypt.hash(password, saltRounds);
		return hashedPass;
	}

	private async isPasswordValid(
		password: string,
		hashedPass: string,
	): Promise<boolean> {
		const isMatch = await bcrypt.compare(password, hashedPass);

		if (!isMatch) throw new UnauthorizedException('Invalid email or password');

		return true;
	}

	private getUserFromToken(refreshToken: string): number {
		const payload = jwt.verify(refreshToken, this.REFRESH_SECRET) as JwtPayload;

		if (!payload.sub) {
			throw new Error('No subject (sub) in token');
		}

		const userId = Number(payload.sub);

		return userId;
	}

	private generateToken(user: UserForToken, expiresIn: string): string {
		const payload = { sub: user.id };
		return this.jwtService.sign(payload, { expiresIn });
	}

	private async generateTokens(user: UserForToken): Promise<{
		access_token: string;
		refresh_token: string;
	}> {
		const [access_token, refresh_token] = await Promise.all([
			this.generateToken(user, this.accessTokenExpires),
			this.generateToken(user, this.refreshTokenExpires),
		]);
		return { access_token, refresh_token };
	}

	private generateTemporaryUsername(email: string): string {
		const basename = email.split('@')[0];
		const randomSuffix = Math.floor(Math.random() * 10000);
		return `user_${basename}${randomSuffix}`;
	}

	@Post('/register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() body: RegisterUserDto) {
		try {
			const { password, email } = body;
			const username = this.generateTemporaryUsername(email);
			const hashedPass = await this.hashPassword(password);

			const { password: _, ...user } = await this.prisma.user.create({
				data: { username, email, password: hashedPass },
			});
			const tokens = await this.generateTokens(user);

			await this.refreshTokenService.saveToken(user.id, tokens.refresh_token);

			this.logger.log(`User registered id: ${user.id}`);
			return {
				tokens,
				user: user,
			};
		} catch (err) {
			this.logger.error('Ошибка регистрации пользователя', err);
			throw err;
		}
	}

	@Post('/login')
	async login(@Body() body: LoginUserDto): Promise<TokensResponse> {
		const { email, password } = body;

		const user = await this.userService.findUserByEmail(email);

		if (!user) throw new UnauthorizedException(`User not found email:${email}`);

		await this.isPasswordValid(password, user.password);

		const tokens = await this.generateTokens(user);

		await this.refreshTokenService.saveToken(user.id, tokens.refresh_token);

		this.logger.log(`User logged in id: ${user.id}`);
		return {
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			expires_in: Math.floor(ms(this.accessTokenExpires) / 1000),
		};
	}

	@UseGuards(JwtAuthGuard)
	@Post('/logout')
	async logout(
		@UserDecorator('id') userId: number,
	): Promise<{ success: boolean }> {
		await this.refreshTokenService.deleteToken(userId);
		this.logger.log(`User ${userId} logout`);
		return { success: true };
	}

	@Post('/refresh')
	async refreshAccessToken(
		@Body() body: { refresh_token: string },
	): Promise<RefreshAccessTokenResponse> {
		const refreshToken = body.refresh_token;
		const userId = this.getUserFromToken(refreshToken);
		this.logger.log(`User id: ${userId} fetched refresh token`);

		if (!(await this.refreshTokenService.isTokenValid(userId, refreshToken)))
			throw new UnauthorizedException('Token invalid');

		const user = await this.userService.getUser(userId);

		const accessToken = this.generateToken(user, this.accessTokenExpires);

		await this.refreshTokenService.setToken(userId, accessToken);

		this.logger.log(`Success refresh access token for user id: ${userId}`);

		return {
			user_id: userId,
			access_token: accessToken,
			expires_in: Math.floor(ms(this.accessTokenExpires) / 1000),
		};
	}
}
