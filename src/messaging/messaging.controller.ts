import { Body, Controller, Post } from '@nestjs/common';

@Controller('messages')
export class MessagingController {

	@Post()
	createMessage(@Body() body: any) {
		console.log('n2es');
	}
}
