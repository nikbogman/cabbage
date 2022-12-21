import * as path from 'path';

import { CacheModule, Module, OnApplicationBootstrap } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/service';

import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';

import { createContext } from './utilities/resolver-context';
import parseCookies from './utilities/parse-websocket-cookies';
import { StartService } from './start.service';

@Module({
    imports: [
        CacheModule.register({
            store: require('cache-manager-redis-yet'),
            host: 'localhost',
            port: 6379,
            isGlobal: true,
        }),
        // probably remove configservice in the fucture because ot is pointless
        ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({
                port: parseInt(process.env.PORT, 10) || 3000,
                secret: process.env.SECRET,
                redis: {
                    host: process.env.REDIS_HOST || "127.0.0.1",
                    port: parseInt(process.env.PORT, 10) || 6739
                }
            })]
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: path.join(process.cwd(), 'graphql/schema.gql'),
            playground: true,
            cors: {
                origin: 'https://studio.apollographql.com',
                credentials: true,
            },
            subscriptions: {
                'subscriptions-transport-ws': {
                    onConnect: (_, extra) => ({
                        cookies: parseCookies(extra.upgradeReq.headers.cookie)
                    }),
                }
            },
            context: ({ req, res }) => createContext(req, res),
        }),
        CatalogModule,
        CartModule,
    ],
    providers: [PrismaService, StartService]
})

export class AppModule { }
