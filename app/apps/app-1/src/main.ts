import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder().setTitle('ETERNAL API').setVersion('2.0').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);


  await app.listen(3000);
}
bootstrap();
