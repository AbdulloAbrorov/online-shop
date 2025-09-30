import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import express from 'express';
import { join } from 'path';
import fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://your-production-domain.com'
        : (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void,
          ) => {
            if (!origin) return callback(null, true);
            const allowed = [
              /^http:\/\/localhost:\d+$/,
              /^http:\/\/127\.0\.0\.1:\d+$/,
            ];
            const explicit = process.env.FRONTEND_URL
              ? [process.env.FRONTEND_URL]
              : [];
            if (
              explicit.includes(origin) ||
              allowed.some((re) => re.test(origin))
            ) {
              return callback(null, true);
            }
            return callback(new Error(`CORS blocked for origin: ${origin}`));
          },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.use(cookieParser());

  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  app.use('/uploads', express.static(uploadsDir));

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
void bootstrap();
