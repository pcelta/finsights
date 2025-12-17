import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { BullBoardSetup } from './build-board-setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for frontend
  app.enableCors();

  // Serve static files from public directory
  app.useStaticAssets(join(__dirname, '..', 'public'));
  BullBoardSetup.setup(app);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
}

bootstrap();
