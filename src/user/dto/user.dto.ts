import { Exclude } from 'class-transformer';

export class UserDto {
	id: string;
	email: string;
	name: string | null;
	username: string;
	created_at: Date;
	updated_at: Date;

	@Exclude()
	avatar_id: string;

	@Exclude()
	password: string;
}
