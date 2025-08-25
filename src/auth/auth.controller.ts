import { Controller, HttpCode, HttpStatus, Logger, Post, UnauthorizedException } from '@nestjs/common';
import { Body } from '@nestjs/common';
import RegisterUserDto from './dto/register-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import LoginUserDto from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserForToken } from './interfaces/user-for-token.interface';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
	private readonly accessTokenExpires: string;
	private readonly refreshTokenExpires: string;

	private readonly logger = new Logger(AuthController.name);

	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private configService: ConfigService
	) {
		this.accessTokenExpires = this.configService.getOrThrow<string>('ACCESS_TOKEN_EXPIRES_IN');
		this.refreshTokenExpires = this.configService.getOrThrow<string>('REFRESH_TOKEN_EXPIRES_IN');
	}

	private async hashPassword(password: string): Promise<string> {
		const saltRounds = 10;
		const hashedPass = await bcrypt.hash(password, saltRounds);
		return hashedPass;
	}

	private async isPasswordValid(password: string, hashedPass: string): Promise<boolean> {
		const isMatch = await bcrypt.compare(password, hashedPass);

		if(!isMatch) throw new UnauthorizedException('Неверный email или пароль');

		return true;
	}

	private async generateToken(user: UserForToken, expiresIn: string): Promise<string> {
		const payload = { sub: user.id };
		return this.jwtService.sign(payload, { expiresIn });
	}

	private async generateTokens(user: UserForToken): Promise<{ 
		access_token:string; 
		refresh_token: string 
	}> {
		const [ access_token, refresh_token ] = await Promise.all([
			this.generateToken(user, this.accessTokenExpires), 
			this.generateToken(user, this.refreshTokenExpires)
		]);
		return { access_token, refresh_token }
	}

	private async findUserByEmail(email: string): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { email }
		});
		
		if(!user) throw new UnauthorizedException ('Такого пользователя не существует');
 
		return user;
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

			const { password: _, ...user } = await  this.prisma.user.create({
				data: { username, email, password: hashedPass }
			})
			const tokens = await this.generateTokens(user); 

			this.logger.log(`Пользователь зарегистрирован id: ${user.id}`);
			return {
				tokens,
				user: user
			};
		} catch (err) {
			this.logger.error('Ошибка регистрации пользователя', err.stack);
			throw err;
		}		
	}

	@Post('/login')
	async login(@Body() body: LoginUserDto) {
		try {
			const { email, password } = body;

			const user = await this.findUserByEmail(email);

			await this.isPasswordValid(password, user.password);

			const tokens = await this.generateTokens(user);

			this.logger.log(`Пользователь залогинился id: ${user.id}`);
			return {
				message: 'Успешный вход',
				tokens,
				user: { 
					id:user.id, 
					email: user.email,
				}
			}
		} catch(err) {
			this.logger.error('Ошибка логина', err.stack);
			throw err;
		}
		
	}
}
