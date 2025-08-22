import { Module } from '@nestjs/common';
import { MessagesController } from './message.controller';

@Module({
  controllers: [MessagesController]
})
export class MessagesModule {}
