import { LoggerService } from '@nestjs/common';
import { logger } from '.';

export class CustomLogger implements LoggerService {
	log(message: any, context?: string) {
		logger.info({ context }, message);
	}

	error(message: any, trace?: string, context?: string) {
		logger.error({ context, trace }, message);
	}

	warn(message: any, context?: string) {
		logger.error({ context }, message);
	}
}
