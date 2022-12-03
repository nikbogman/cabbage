import { Field, ObjectType } from '@nestjs/graphql';

export interface IFieldedError {
    path: string;
    message: string;
    issue: string;
}

export class FieldedError extends Error {
    readonly issue: string;
    readonly message: string;

    constructor(issue: string, message: string) {
        super(message);
        this.issue = issue;
        this.message = message;
    }
}

@ObjectType('FieldedError')
export class FieldedErrorObjectType implements IFieldedError {
    @Field()
    path: string;

    @Field()
    issue: string;

    @Field()
    message: string;
}