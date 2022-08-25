import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'prisma/service';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';

@Module({
  imports: [UserModule],
  providers: [AuthResolver, AuthService, UserService, PrismaService],
})
export class AuthModule { }
