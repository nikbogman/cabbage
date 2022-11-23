import * as ExpressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { env } from '../config';

export interface MySessionData {
    total: number;
    userId: string;
}

declare module 'express-session' {
    interface SessionData extends MySessionData { }
}

export type SessionType = ExpressSession.Session & Partial<ExpressSession.SessionData>;

export const sessionMiddleware = (prisma: PrismaClient) => ExpressSession({
    resave: false,
    saveUninitialized: false,
    secret: env.secret,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    )
})

export const Session = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req.session;
    },
)