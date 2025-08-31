import { Controller, Get, Param, ParseIntPipe, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersResponse } from 'shared/types/user';
import User from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UnauthorizedFilter } from 'src/filters/unauthorized.filter';

@Controller('users')
@UseFilters(new UnauthorizedFilter())
@UseGuards(JwtAuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':userId')
	async getUser(
		@Param('userId', ParseIntPipe) userId: number
	) {
		const user = await this.userService.getUser(userId);
		return user;
	}

	@Get()
	async getUsers(
		@User('id') currentUserId: number
	): Promise<UsersResponse> {
		const users = await this.userService.getUsers();
		console.log(currentUserId);
		const filteredUsers = users.filter(user => 
			user.id !== currentUserId
		);
		return {users: filteredUsers}
	}
}
