import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { FieldedError } from 'src/utilities/error';
import { ItemResponse } from './item.object-type';
import { ItemService } from './item.service';

@Resolver()
export class ItemResolver {
    constructor(
        private readonly itemService: ItemService,
    ) { }

    @Query(() => ItemResponse)
    async item(@Args('id') id: string) {
        const item = await this.itemService.findWhere({ where: { id } });
        if (!item)
            throw new FieldedError('id argument', `Item with id ${id} not Found`)
        return { data: item }
    }
}

