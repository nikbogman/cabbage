import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { gqlSchemaFile as autoSchemaFile } from './config';
import { PrismaService } from '../prisma/service';

import { AuthModule } from './auth/auth.module';
import { CashierModule } from './cashier/cashier.module';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile,
      context: ({ req }) => ({ req })
    }),
    AuthModule, CatalogModule, CashierModule],
  providers: [PrismaService]
})
export class AppModule { }
