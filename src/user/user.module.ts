import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
	imports: [ChatModule],
	controllers: [UserController],
	exports: [UserService],
	providers: [UserService],
})
export class UserModule {}
