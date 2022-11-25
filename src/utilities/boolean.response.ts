import { ObjectType } from '@nestjs/graphql';
import { Response } from './response';

@ObjectType()
export class BooleanResponse extends Response(Boolean) { }