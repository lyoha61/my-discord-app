import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {
	private readonly logger = new Logger(UnauthorizedFilter.name);

	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		this.logger.error(`${request.method} ${request.url} ${exception.message}`);

		response.status(HttpStatus.UNAUTHORIZED).json({
			statusCode: HttpStatus.UNAUTHORIZED,
			message: exception.message,
			errorCode: 'TOKEN_MISSING_OR_INVALID',
		});
	}
}
