import * as path from 'path';

import { CacheModule, Module, OnApplicationBootstrap } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { ConfigModule } from '@nestjs/config';

import { PrismaService } from '../prisma/service';

import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';

import { createContext } from './utilities/resolver-context';
import parseCookies from './utilities/parse-websocket-cookies';

@Module({
    imports: [
        // migrate to sqlite
        CacheModule.register({
            isGlobal: true,
        }),
        // probably remove configservice in the fucture because ot is pointless
        ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({
                port: parseInt(process.env.PORT, 10) || 3000,
                secret: process.env.SECRET,
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
                // switch to graphql-ws
                'subscriptions-transport-ws': {
                    onConnect: (_, extra) => {
                        const CookieHeader: string = extra.upgradeReq.headers.cookie;
                        return { cookies: CookieHeader ? parseCookies(extra.upgradeReq.headers.cookie) : '' }
                    },
                }
            },
            context: (ctx) => createContext(ctx),
        }),
        CatalogModule,
        CartModule,
    ],
    providers: [PrismaService]
})

export class AppModule { }
