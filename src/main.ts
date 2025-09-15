import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { CustomLogger } from './logger/custom-logger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
		logger: false,
	});

	app.useLogger(new CustomLogger());

	app.useGlobalFilters(new AllExceptionsFilter());

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
