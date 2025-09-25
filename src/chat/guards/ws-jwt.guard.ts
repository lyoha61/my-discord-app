import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { EVENTS } from 'shared/types/websocket/events';
import { ChatSocket } from 'shared/types/websocket/socket';


@Injectable()
export class WsJwtGuard implements CanActivate {
	private readonly logger = new Logger(WsJwtGuard.name);

	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext) {
		const client: ChatSocket = context.switchToWs().getClient();
		const token = client.handshake.auth.access_token;
		try {
			if (!token) throw new WsException('Token is missing');

			const payload = this.jwtService.verify<{ sub: string }>(token);
			client.data.user = { id: payload.sub };
			return true;
		} catch (err) {
			if (err instanceof Error) {
				this.logger.error(
					`Client ${client.id} send invalid token: ${err.message}`,
				);
			} else {
				this.logger.error(
					`Client ${client.id} send invalid token: ${err}`,
				);
			}
			client.emit(EVENTS.TOKEN_EXPIRED);
			throw new WsException('Invalid Token');
		}
	}
}
