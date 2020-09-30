import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const logger = new Logger('bootstrap');  
  // using NODE_ENV
  const serverConfig = config.get('server');
  const app = await NestFactory.create(AppModule);
  // using environment value first
  const port = process.env.PORT || serverConfig.port;
  const options = new DocumentBuilder()
  .setTitle('Task management')
  .addBearerAuth()
  .setDescription('Task management api description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, options);
  
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
  logger.log(`Aplication listening on port ${port}`);
}

bootstrap();
