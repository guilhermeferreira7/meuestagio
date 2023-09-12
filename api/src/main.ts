import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dataSource } from './database/data-source';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('MeuEstagio API')
    .setDescription('API para o projeto de TCC MeuEstagio')
    .setVersion('1.0')
    .addTag('MeuEstagio')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();

  await app.listen(process.env.APP_PORT);

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
}
bootstrap();
