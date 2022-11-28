import { Request, Response } from "express";

export function createContext(req: Request, res: Response) {
    const cookies = {
        get: (key: string) => req.cookies[key],
        set: (key: string, value: any) => res.cookie(key, value)
    }
    return { req, res, cookies }
}

export type MyContextType = ReturnType<typeof createContext>;