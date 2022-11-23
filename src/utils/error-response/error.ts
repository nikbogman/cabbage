import { ObjectType, Field } from "@nestjs/graphql";

export interface IFieldedError {
    field: string;
    message: string;
}

@ObjectType('FieldError')
export class FieldedErrorType implements IFieldedError {
    @Field()
    field: string;

    @Field()
    message: string;
}

export const createFieldError = (field: string, message: string) => ({
    error: { field, message }
})

export class FieldedError extends Error implements IFieldedError {
    constructor(public readonly field: string, public readonly message: string) {
        super(message);
    }

    get fields() {
        return {
            error: {
                field: this.field,
                message: this.message
            }
        }
    }
}