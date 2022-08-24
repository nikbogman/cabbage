import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { UserResponse } from './user/user.type';
import { AuthInput } from './auth.type';
import { AuthService } from './auth.service';
import { Session } from 'src/utils/functions';
import { BooleanResponse } from 'src/utils/graphql-types';
import { SessionType } from 'src/utils/types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(type => UserResponse)
  async register(@Args() input: AuthInput) {
    return this.authService.register(input);
  }

  @Mutation(type => UserResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Session() session: SessionType
  ) {
    return this.authService.login(email, password, session);
  }

  @Mutation(type => BooleanResponse)
  async logout(
    @Session() session: SessionType
  ) {
    return this.authService.logout(session);
  }
}
