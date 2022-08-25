import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/service';
import { sessionMiddleware } from './session';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaClient = app.get(PrismaService)
  app.use(sessionMiddleware(prismaClient))
  await app.listen(3000);
}
bootstrap();
