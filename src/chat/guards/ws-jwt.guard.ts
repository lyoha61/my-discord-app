import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private readonly jwtService: JwtService){}

  canActivate(
    context: ExecutionContext,
  ) {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth.access_token;
    try {
      if(!token) throw new WsException('Token is missing');

      const payload = this.jwtService.verify<{ sub:number }>(token);
      client.data.user = {id: payload.sub}
      return true;
    } catch(err) {
      this.logger.error(`Client ${client.id} send invalid token: ${err.message}`);
      throw new WsException('Invalid Token');
    }
  }
}
