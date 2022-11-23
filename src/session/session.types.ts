import * as ExpressSession from 'express-session';

export interface MySessionData {
    cartId: string;
    total: number;
    userId: string;
}

declare module 'express-session' {
    interface SessionData extends MySessionData { }
}

export type SessionType = ExpressSession.Session & Partial<ExpressSession.SessionData>;
