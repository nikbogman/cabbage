import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { UserResponse } from './user/user.type';
import { AuthInput } from './auth.type';
import { AuthService } from './auth.service';
import { SessionType } from 'src/session/session.types';
import { BooleanResponse } from '../utils/error-response/response';
import { CartService } from 'src/services/cart.service';
import { Session } from 'src/session/session.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly cartService: CartService
  ) { }

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

  //
  @Mutation(type => BooleanResponse)
  async logout(
    @Session() session: SessionType
  ) {
    // if (!await this.cartService.purgeCart(session))
    //   return { data: false, error: { message: "Cart is already empthy", field: "session" } }
    // if (!await this.authService.logout(session))
    //   return { data: false, error: { message: "User not logged in", field: "session" } }
    // session.destroy(err => { })
    // return { data: true }
  }
}
