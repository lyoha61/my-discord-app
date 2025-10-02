import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'src/message/message.module';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
	imports: [
		MessageModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get('JWT_SECRET'),
			}),
		}),
	],
	providers: [ChatGateway, WsJwtGuard, ChatService],
	controllers: [ChatController],
	exports: [ChatService],
})
export class ChatModule {}
