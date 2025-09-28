import { LoggerService } from '@nestjs/common';
import { logger } from '.';

export class CustomLogger implements LoggerService {
	log(message: any, context?: string) {
		logger.info({ context }, message);
	}

	error(message: any, trace?: string, context?: string) {
		let msg: string;
		if (message instanceof Error) {
			msg = message.message;
			trace = message.stack;
		} else {
			msg = String(message);
		}
		logger.error({ context, trace }, msg);
	}

	warn(message: any, context?: string) {
		logger.error({ context }, message);
	}
}
