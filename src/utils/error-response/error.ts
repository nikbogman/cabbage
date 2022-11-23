import { ObjectType, Field } from "@nestjs/graphql";

export interface IFieldError {
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

export const createFieldError = (field: string, message: string) => ({
    error: { field, message }
})

export class MyError extends Error implements IFieldError {
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