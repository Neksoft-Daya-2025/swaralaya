import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for React frontend (Vite may use 5173, 5174, etc.)
  const configuredOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser / same-origin requests (no Origin header)
      if (!origin) {
        callback(null, true);
        return;
      }
      const isLocalVite =
        /^http:\/\/(localhost|127\.0\.0\.1):(5173|5174|5175|4173)(\/)?$/.test(origin);
      if (origin === configuredOrigin || isLocalVite) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Serve uploaded files statically
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  await app.listen(process.env.PORT || 3001);
  console.log(`🚀 Swaralaya Backend running on http://localhost:${process.env.PORT || 3001}`);
}
bootstrap();
