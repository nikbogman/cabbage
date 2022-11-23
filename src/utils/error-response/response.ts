import { Type } from "@nestjs/common";
import { Field, ObjectType } from "@nestjs/graphql";
import { FieldedErrorType, IFieldedError } from "./error";

export interface IResponseType<T> {
    error?: IFieldedError;
    data?: T;
}

export function Response<T>(classRef: Type<T>): Type<IResponseType<T>> {
    @ObjectType({ isAbstract: true })
    abstract class ResponseType implements IResponseType<T> {
        @Field(() => FieldedErrorType, { nullable: true })
        error?: IFieldedError;

        @Field(() => classRef, { nullable: true })
        data?: T;
    }
    return ResponseType as Type<IResponseType<T>>;
}

@ObjectType()
export class BooleanResponse extends Response(Boolean) { }