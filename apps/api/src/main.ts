import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { setupSwagger } from './swagger.js';

async function bootstrap() {
  // rawBody lets the Paystack webhook check its signature against the exact bytes sent.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    rawBody: true,
  });

  // Spreadsheet imports send up to 2,000 rows as JSON.
  app.useBodyParser('json', { limit: '5mb' });
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter());
  const docs = setupSwagger(app);

  const PORT = process.env.PORT || 5445;
  await app.listen(PORT);
  console.log(`Server is running on port http://localhost:${PORT}`);
  if (docs) console.log(`API docs at http://localhost:${PORT}/api/docs`);
}
bootstrap();
