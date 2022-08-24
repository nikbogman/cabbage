import { ObjectType, Field, ID } from "@nestjs/graphql";
import { User as Model } from "@prisma/client";
import { Response } from "src/utils";

@ObjectType()
export default class User implements Model {
    @Field(type => ID)
    id: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    address: string;

    @Field()
    mobileNumber: string;

    @Field()
    hash: string;

    @Field()
    salt: string;

    @Field()
    email: string;
}

@ObjectType()
export class UserResponse extends Response(User) { }
