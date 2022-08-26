import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Cart as Model } from "@prisma/client";
import { Response } from "../../utils/error-response";
import Item from "../item/item.type";

export interface ICart extends Model {
    items: Item[]
}

@ObjectType()
export default class Cart implements ICart {
    @Field(type => ID)
    id: string;

    @Field()
    total: number;

    @Field({ nullable: true })
    userId: string

    @Field(type => [Item], { defaultValue: [] })
    items: Item[];
}

@ObjectType()
export class CartResponse extends Response(Cart) { }