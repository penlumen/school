import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  // rawBody lets the Paystack webhook check its signature against the exact bytes sent.
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter());

  const PORT = process.env.PORT || 5445;
  await app.listen(PORT);
  console.log(`Server is running on port http://localhost:${PORT}`);
}
bootstrap();
