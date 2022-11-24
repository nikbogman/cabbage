import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'prisma/service';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { CartModule } from 'src/modules/cart.module';
import { CartService } from 'src/services/cart.service';

@Module({
  imports: [UserModule, CartModule],
  providers: [AuthResolver, AuthService, UserService, CartService, PrismaService],
})
export class AuthModule { }
