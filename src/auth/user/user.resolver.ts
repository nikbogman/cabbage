import { Resolver, Query } from "@nestjs/graphql";
import { Session } from "src/session.decorator";
import { SessionType } from "src/types";
import { createFieldError } from "src/utils";
import { UserService } from "./user.service";
import { UserResponse } from "./user.type";

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(type => UserResponse)
    async me(@Session() { userId }: SessionType) {
        if (!userId) return createFieldError('userId', 'User not logged in')
        const user = this.userService.find({ id: userId });
        if (!user)
            return createFieldError('id', 'No user with this id');
        return { data: user }
    }
}