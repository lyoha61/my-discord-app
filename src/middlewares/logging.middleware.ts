import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from 'src/logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		const startTime = Date.now();
    
    res.on('finish', () => {
      logger.info({
        req: {
          id: randomUUID(),
          method: req.method,
          url: req.url,
          userId: req.user?.id || null
        },
        res: {
          statusCode: res.statusCode
        },
        responseTime: Date.now() - startTime
      }, 'Request completed');
    });
		next();
	}
}
