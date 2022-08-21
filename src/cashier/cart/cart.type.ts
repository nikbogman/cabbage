import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Cart as Model } from "@prisma/client";
import Item from "../item/item.type";

interface ICart extends Model {
    items: Item[]
}

@ObjectType()
export default class Cart implements ICart {
    @Field(type => ID)
    id: string;

    @Field()
    total: number;

    @Field()
    sessionId: string;

    @Field(type => [Item], { defaultValue: [] })
    items: Item[];
}

