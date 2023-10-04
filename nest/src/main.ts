import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { IConfig } from './public/configuration';

async function bootstrap() {
  console.log('Starting application...');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 600,
    },
  });
  console.log('Application created...');

  app.use(helmet());
  app.use(json({ limit: '30mb' }));
  app.use(urlencoded({ extended: true, limit: '30mb' }));

  app.enableVersioning({
    type: VersioningType.URI,
    // with this we don't have to specify for each controller the version
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService: ConfigService<IConfig> = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port, async () => {
    console.log(`Your Application is running on: ${await app.getUrl()}`);
  });
}

bootstrap();
