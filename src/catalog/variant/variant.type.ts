import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Variant as Model } from "@prisma/client";
import Item from "../../cashier/item/item.type";

interface IVariant extends Model {
    items: Item[]
}

@ObjectType()
export default class Variant implements IVariant {
    @Field(type => ID)
    id: string;

    @Field()
    slug: string;

    @Field()
    name: string;

    @Field()
    optionName: string;

    @Field()
    description: string;

    @Field()
    price: number;

    @Field()
    stock: number;

    @Field()
    committed: number;

    @Field()
    availability: number;

    @Field()
    productId: string;

    @Field(type => [Item], { defaultValue: [] })
    items: Item[];
}

