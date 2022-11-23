import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import * as ExpressSession from 'express-session';
import { env } from '../config';

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


