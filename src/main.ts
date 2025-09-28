import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { CustomLogger } from './logger/custom-logger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
		logger: new CustomLogger(),
	});

	app.flushLogs()

	app.setGlobalPrefix('api/v1')

	app.useGlobalFilters(new AllExceptionsFilter());

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
