import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':userId')
	async getUser(
		@Param('userId', ParseIntPipe) userId: number
	) {
		const user = await this.userService.getUser(userId);
		return user;
	}
}
