import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { gqlSchemaFile as autoSchemaFile } from './config';
import { PrismaService } from '../prisma/service';

import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './modules/#catalog.module';
import { CashierModule } from './modules/cashier.module';

import { GlobalModule } from './utils/pubsub.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile,
      context: ({ req }) => ({ req })
    }),
    GlobalModule,
    AuthModule, CatalogModule, CashierModule],
  providers: [PrismaService]
})
export class AppModule { }
