import { Exclude } from "class-transformer";

export class UserDto {
	id: number;
	email: string;
	name: string | null;
	username: string;
	created_at: Date;
	updated_at: Date;

	@Exclude()
	password: string;

}