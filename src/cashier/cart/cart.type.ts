import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Cart as Model } from "@prisma/client";
import { Response } from "../../utils/error-response";

@ObjectType()
export default class Cart implements Model {
    @Field(type => ID)
    id: string;

    @Field()
    total: number;

    @Field({ nullable: true })
    userId: string

    @Field()
    sessionId: string;
}

@ObjectType()
export class CartResponse extends Response(Cart) { }