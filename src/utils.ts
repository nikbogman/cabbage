import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

interface IFieldError {
    field: string;
    message: string;
}

@ObjectType()
export class FieldError implements IFieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

export interface IResponseType<T> {
    error?: IFieldError;
    data?: T;
}

export function Response<T>(classRef: Type<T>): Type<IResponseType<T>> {
    @ObjectType({ isAbstract: true })
    abstract class ResponseType implements IResponseType<T> {
        @Field(() => FieldError, { nullable: true })
        error?: IFieldError;

        @Field(() => classRef, { nullable: true })
        data?: T;
    }
    return ResponseType as Type<IResponseType<T>>;
}

export const createFieldError = (field: string, message: string) => ({ error: { field, message } })

