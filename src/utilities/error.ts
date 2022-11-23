import { Field, ObjectType } from '@nestjs/graphql';

export interface IFieldedError {
    path: string;
    message: string;
    issue: string;
}

export class FieldedError extends Error {
    readonly path: string;
    readonly issue: string;
    readonly message: string;

    constructor(path: string, issue: string, message: string) {
        super(message);
        this.path = path;
        this.issue = issue;
        this.message = message;
    }

    getFields(): { error: IFieldedError } {
        return { error: { path: this.path, issue: this.issue, message: this.message } }
    }

    static throwError(path: string, issue: string, error: any) {
        if (error instanceof FieldedError)
            return error.getFields();
        return new FieldedError(path, issue, error.message).getFields();
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