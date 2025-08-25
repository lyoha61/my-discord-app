import { IsEmail, IsString, MinLength } from "class-validator";

export default class RegisterUserDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(3)
	password: string;
}