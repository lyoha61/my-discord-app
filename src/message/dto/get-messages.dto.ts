import { IsIn, IsOptional } from "class-validator";

export class GetMessagesDto {
	@IsOptional()
	@IsIn(['asc', 'desc'])
	sort?: 'asc' | 'desc' = 'asc';
}