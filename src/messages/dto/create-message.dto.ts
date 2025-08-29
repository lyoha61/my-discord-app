import { IsNotEmpty } from "class-validator";

export default class CreateMessageDto {
	@IsNotEmpty()
	text: string;
}