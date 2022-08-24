import { ObjectType } from "@nestjs/graphql";
import { Response } from "./utils";

@ObjectType()
export class BooleanResponse extends Response(Boolean) { }