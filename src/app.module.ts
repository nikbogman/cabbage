import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { gqlSchemaFile as autoSchemaFile } from './config';
import { PrismaService } from '../prisma/service';

import { AuthModule } from './auth/auth.module';
import { CashierModule } from './cashier/cashier.module';
import { CatalogModule } from './catalog/catalog.module';

import { PubSub } from "graphql-subscriptions";
import { GlobalModule } from './utils/pubsub.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      autoSchemaFile,
      context: ({ req }) => ({ req })
    }),
    GlobalModule,
    AuthModule, CatalogModule, CashierModule],
  providers: [PrismaService]
})
export class AppModule { }
