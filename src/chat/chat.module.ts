import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from 'src/messages/messages.module';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [MessagesModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET')
      })
    })
  ],
  providers: [ChatGateway, WsJwtGuard]
})
export class ChatModule {}
