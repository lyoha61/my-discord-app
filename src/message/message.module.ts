import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
	imports: [S3Module],
	controllers: [MessageController],
	providers: [MessageService],
	exports: [MessageService],
})
export class MessageModule {}
