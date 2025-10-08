import {
	Controller,
	Get,
	Logger,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseFilters,
	UseGuards,
	UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { FileKey } from 'src/common/types/s3.types';
import { S3Service } from 'src/s3/s3.service';
import { Buckets } from 'src/common/constants/buckets';
import { UploadFile } from 'src/chat/types/uploadFile';

@Controller('users')
@UseFilters(new UnauthorizedFilter())
@UseGuards(JwtAuthGuard)
export class UserController {
	private readonly logger = new Logger(UserController.name);

	constructor(
		private readonly userService: UserService,
		private readonly chatService: ChatService,
		private readonly s3Service: S3Service,
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
		const user = await this.userService.getUser(userId);

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

	@Patch('profile')
	@UseInterceptors(FileInterceptor('avatar'))
	async updateUser (
		@User('id') userId: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		if (file) {
			const { originalname, buffer, mimetype, size} = file;
			const key: FileKey = `avatars/${userId}-${originalname}`;
			const url = await this.s3Service.uploadFile(Buckets.APP, key, buffer);

			const fileData: UploadFile = {
				key,
				url, 
				bucket: Buckets.APP,
				filename: originalname,
				size,
				mimetype
			}

			const uploadedFile = await this.userService.loadAvatar(userId, fileData);
		}

	}
}
