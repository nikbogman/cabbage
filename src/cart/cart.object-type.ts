import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Cart as Model } from "@prisma/client";
import { Response } from "src/utilities/response";
import { Item } from "./item/item.object-type";

@ObjectType()
export class Cart implements Model {
    @Field(type => ID)
    id: string;

    @Field()
    total: number;

    @Field({ nullable: true })
    userId: string

    @Field()
    expiresAt: Date;

    @Field(() => [Item])
    items: Item[]
}


@ObjectType()
export class CartResponse extends Response(Cart) { }