import { Session, SessionData } from "express-session";

export interface MySessionData {
    cartId: string;
    total: number;
    userId: string;
}
export type SessionType = Session & Partial<SessionData>;

export type Context = { session: SessionType }