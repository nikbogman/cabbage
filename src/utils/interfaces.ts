export interface MySessionData {
    cartId: string;
    total: number;
    userId: string;
}

export interface IFieldError {
    field: string;
    message: string;
}

export interface IResponseType<T> {
    error?: IFieldError;
    data?: T;
}


