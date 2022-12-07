import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Variant as Model } from "@prisma/client";
import { FieldedErrorObjectType, IFieldedError } from "src/utilities/error";
import { ArrayResponse, Response } from "src/utilities/response";

@ObjectType()
export class Variant implements Model {
    @Field(() => ID)
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
    productId: string;

    @Field()
    committed: number;

    @Field()
    availability: number;
}

@ObjectType()
export class VariantsResponse extends ArrayResponse(Variant) { }

@ObjectType()
export class VariantResponse extends Response(Variant) { }