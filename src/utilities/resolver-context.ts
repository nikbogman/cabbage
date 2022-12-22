import { Request, Response } from "express";

interface HttpContext {
    req: Request,
    res: Response
}

export function createContext(httpCtx: HttpContext) {
    const cookies = {
        get: (key: string) => httpCtx.req.cookies[key],
        set: (key: string, value: any) => httpCtx.res.cookie(key, value,
            {
                //     maxAge: 600,
                //     expires: new Date(Date.now() + 600),
                secure: true,
                sameSite: 'none'
                //     httpOnly: true,
            }
        )
    }
    return { httpCtx, cookies }
}

export type MyContextType = ReturnType<typeof createContext>;