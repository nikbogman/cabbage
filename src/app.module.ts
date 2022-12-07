import * as path from 'path';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/service';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';

import { createContext } from './utilities/resolver-context';

function parseCookies(cookies) {
    const list = {}
    cookies.split(`;`).forEach(function (cookie) {
        let [name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        let decoded = decodeURIComponent(value);
        if (decoded[0] === 'j') {
            const obj = decoded.substring(1);
            decoded = JSON.parse(`{"${decoded[0]}"${obj}}`)["j"]
        }
        list[name] = decoded;
    });
    return list;
}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({
                port: parseInt(process.env.PORT, 10) || 3000,
                secret: process.env.SECRET
            })]
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
                return {
                    config: {
                        host: 'localhost',
                        port: 6379,
                    }
                };
            }
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: true,
            autoSchemaFile: path.join(process.cwd(), 'graphql/schema.gql'),
            subscriptions: {
                'subscriptions-transport-ws': {
                    //connectionParams: Object, webSocket: WebSocket, context
                    onConnect: (connectionParams, extra) => {
                        console.log(extra.upgradeReq.headers.cookie)
                        const cookies = parseCookies(extra.upgradeReq.headers.cookie);
                        return { cookies };
                        // console.log(webSocket.onopen(e => ))
                        // console.log(context)
                        // return {}
                    },
                }
            },
            context: ({ req, res }) => createContext(req, res),
        }),
        CatalogModule,
        CartModule,
    ],
    providers: [PrismaService]
})
export class AppModule { }
