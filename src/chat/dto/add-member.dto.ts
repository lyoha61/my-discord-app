import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AddMemberChatDto {
	@IsArray()
	@ArrayNotEmpty()
	@IsInt({ each: true })
	user_ids: number[];
}
