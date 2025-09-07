import { IsNotEmpty } from 'class-validator';

export default class UpdateMessageDto {
	@IsNotEmpty()
	text: string;
}
