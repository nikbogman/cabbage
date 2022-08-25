import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { AuthModule } from './auth/auth.module';
import { CashierModule } from './cashier/cashier.module';
import { PrismaService } from '../prisma/service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
      context: ({ req }) => ({ req })
    }),
    AuthModule, CatalogModule, CashierModule],
  providers: [PrismaService]
})
export class AppModule { }
