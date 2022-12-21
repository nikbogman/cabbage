import { Request, Response } from "express";

export function createContext(req: Request, res: Response) {
    const cookies = {
        get: (key: string) => req.cookies[key],
        set: (key: string, value: any) => res.cookie(key, value,
            {
                //     maxAge: 600,
                //     expires: new Date(Date.now() + 600),
                secure: true,
                sameSite: 'none'
                //     httpOnly: true,
            }
        )
    }
    return { req, res, cookies }
}

export type MyContextType = ReturnType<typeof createContext>;