import { IsNotEmpty } from 'class-validator';

export class CreatePrivateChatDto {
	@IsNotEmpty()
	user_id: string;
}
