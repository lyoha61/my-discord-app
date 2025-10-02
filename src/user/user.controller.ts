import {
	Controller,
	Get,
	Logger,
	Param,
	Query,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
	User as UserType,
	UserResponse,
	UsersResponse,
} from 'shared/types/user';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UnauthorizedFilter } from 'src/filters/unauthorized.filter';
import { UserDto } from './dto/user.dto';
import { ChatService } from 'src/chat/chat.service';

@Controller('users')
@UseFilters(new UnauthorizedFilter())
@UseGuards(JwtAuthGuard)
export class UserController {
	private readonly logger = new Logger(UserController.name);

	constructor(
		private readonly userService: UserService,
		private readonly chatService: ChatService,
	) {}

	private formattedUser(user: UserDto): UserType {
		return {
			...user,
			created_at: user.created_at.toISOString(),
			updated_at: user.updated_at.toISOString(),
		};
	}

	@Get('/me')
	async getMe(@User('id') userId: string): Promise<UserResponse> {
		const user = await this.userService.getMe(userId);

		return { user: this.formattedUser(user) };
	}

	@Get(':userId')
	async getUser(
		@Param('userId') userId: string,
	): Promise<UserResponse> {
		const user = await this.userService.getUser(userId);

		return { user: this.formattedUser(user) };
	}

	@Get()
	async getUsers(
		@User('id') currentUserId: string,
		@Query('search') search?: string,
	): Promise<UsersResponse> {
		const users = await this.userService.getUsers(search);

		const userChats = await this.chatService.getPrivateChats(currentUserId);

		const usersIdsChats = userChats.flatMap(chat => chat.members.map(m => m.user_id))

		const filteredUsers = users
			.filter((user) => 
				user.id !== currentUserId && 
				!usersIdsChats.includes(user.id))
			.map((user) => this.formattedUser(user));

		return { users: filteredUsers };
	}
}
