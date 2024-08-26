import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  
  // Configura o CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL') || '*', // Permite qualquer origem se não estiver definida
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  });

  await app.listen(3030);
}
bootstrap();
