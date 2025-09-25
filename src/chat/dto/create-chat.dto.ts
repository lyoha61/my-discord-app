import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class CreateChatDto {
	@IsArray()
	@ArrayNotEmpty()
	@IsInt({ each: true })
	user_ids: string[];
}
