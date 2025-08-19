import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import compression from 'compression';
import errorHandler from 'errorhandler';
import { urlencoded } from 'express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import passport from 'passport';
import { ExceptionHelper } from './Helper/Exception.helper';
import { CommonSeederService } from './Database/Seeds/CommonSeeder.service';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: '*', exposedHeaders: '*' },
  });
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(compression());
  app.use(errorHandler());
  app.use(urlencoded({ limit: '500mb', extended: true }));
  app.use(passport.initialize());
  // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ExceptionHelper());
  const config = new DocumentBuilder()
    .setTitle('Code Move')
    .addBearerAuth()
    .setDescription('Code Move API Description')
    .setVersion('1.0')
    .setExternalDoc('Postman Collection', '/swagger-json')
    .setContact("Code Move", "https://codemove.co.uk/", "codemove.co.uk")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, { swaggerOptions: { tagsSorter: 'alpha', enableSearch: true } });
  const _ConfigService = app.get(ConfigService);
  const port = process.env.PORT || _ConfigService.get('PORT');
  await app.listen(port);
  console.log(`Application is running on port ${port}`);

  if (_ConfigService.get("Database.Seed") == "true") {
    const _CommonSeederService = app.get(CommonSeederService);
    await _CommonSeederService.Run();
  }
}
bootstrap();
