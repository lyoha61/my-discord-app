import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		this.logger.error(exception);
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		
		const status = exception instanceof HttpException 
			? exception.getStatus() 
			: HttpStatus.INTERNAL_SERVER_ERROR;
		
		response.status(status).json({
			path: request.url,
			statusCode: 400,
			message: exception instanceof Error 
				? exception.message 
				: 'Internal server error',
		
		});
	}
}