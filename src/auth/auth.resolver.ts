import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { UserResponse } from './user/user.type';
import { AuthInput } from './auth.type';
import { AuthService } from './auth.service';
import { Session, SessionType } from '../session';
import { BooleanResponse } from '../utils/error-response/response';
import { CartService } from 'src/cashier/cart/cart.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly cartService: CartService) { }

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
    const cart = await this.cartService.purgeCart(session)
    const user = await this.authService.logout(session)
    session.destroy(err => { })
    return { data: cart === user }
  }
}
