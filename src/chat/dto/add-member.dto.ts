import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class AddMemberChatDto {
	@IsArray()
	@ArrayNotEmpty()
	@IsInt({ each: true })
	user_ids: string[];
}
