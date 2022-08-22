import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaService } from './prisma.service';

declare module 'express-session' {
  interface SessionData {
    total: number
    cartId: string,
    userId: string
  }
}



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const pismaClient = app.get(PrismaService)
  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'jdsfsdfnkdsnfsn',
    store: new PrismaSessionStore(
      pismaClient,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  }))
  await app.listen(3000);
}
bootstrap();
