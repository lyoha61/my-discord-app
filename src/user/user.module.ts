import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ChatModule } from 'src/chat/chat.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
	imports: [ChatModule, S3Module],
	controllers: [UserController],
	exports: [UserService],
	providers: [UserService],
})
export class UserModule {}
