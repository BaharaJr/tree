import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './core/interceptors/errors.interceptor';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { system } from './core/system/system.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const PORT = process.env.PORT || 3000;
  system();
  await app.listen(PORT);
  Logger.debug(`App listening on port: ${PORT}`, 'APP');
}
bootstrap();
