import { Resolver, Query } from "@nestjs/graphql";
import { SessionType, Session } from "../../session";
import { createFieldError } from "../../utils/error-response";
import { UserService } from "./user.service";
import { UserResponse } from "./user.type";

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(type => UserResponse)
    async me(@Session() session: SessionType) {
        const { userId } = session;
        if (!userId) return createFieldError('userId', 'User not logged in')
        const user = this.userService.find({ id: userId });
        if (!user) return createFieldError('id', 'No user with this id');
        return { data: user }
    }
}