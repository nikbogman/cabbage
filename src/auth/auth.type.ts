import { Field, ArgsType } from "@nestjs/graphql";

@ArgsType()
export class AuthInput {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    address: string;

    @Field()
    mobileNumber: string;

    @Field()
    email: string;

    @Field()
    password: string;
}