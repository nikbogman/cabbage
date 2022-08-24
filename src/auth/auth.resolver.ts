import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { createFieldError } from 'src/utils';
import { Session } from 'src/session.decorator';
import { SessionType } from 'src/types';
import { UserResponse } from './user/user.type';
import { AuthInput } from './auth.type';
import { AuthService } from './auth.service';
import { BooleanResponse } from 'src/boolean.response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(type => UserResponse)
  async register(@Args() input: AuthInput) {
    return this.authService.register(input)
  }

  @Mutation(type => UserResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Session() session: SessionType
  ) {
    return this.authService.login(email, password, session)
  }

  @Mutation(type => BooleanResponse)
  async logout(
    @Session() session: SessionType
  ) {
    if (!session.userId) return createFieldError('userId', 'User not logged in')
    session.userId = undefined;
    return { data: true }
  }
}
