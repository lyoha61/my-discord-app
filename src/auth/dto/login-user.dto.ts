import { IsString } from 'class-validator';

export default class LoginUserDto {
	@IsString()
	email: string;
	@IsString()
	password: string;
}
