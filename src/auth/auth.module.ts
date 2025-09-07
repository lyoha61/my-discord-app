import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenService } from './refresh-token.service';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow<string>('JWT_SECRET'),
			}),
		}),
		UserModule,
	],
	providers: [JwtStrategy, RefreshTokenService],
	controllers: [AuthController],
})
export class AuthModule {}
