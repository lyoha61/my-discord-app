import { IsEmail, IsString, MinLength } from "class-validator";

export default class RegisterUserDto {
	@IsString()
	username: string;

	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@IsString()
	@MinLength(3)
	password: string;
}