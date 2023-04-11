import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import config from '../config/config';
import { AppModule } from './app.module';
import { dataSource } from './database/data-source';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(config().port);

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
