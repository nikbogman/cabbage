import { Injectable } from '@nestjs/common';
import { AuthInput } from './auth.type';
import { UserService } from './user/user.service';

import * as bcrypt from 'bcrypt';
import * as shortid from 'shortid';

import { createFieldError } from 'src/utils';
import { SessionType } from 'src/types';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

    async register(input: AuthInput) {
        const existingUser = await this.userService.find({ email: input.email });
        if (existingUser) return createFieldError('email', 'User with this email already exists')
        const salt: string = await bcrypt.genSalt(12);
        const hash: string = await bcrypt.hash(input.password, salt);
        const { password, ...createInput } = input;
        const user = await this.userService.create({
            id: shortid.generate(), salt, hash,
            ...createInput
        });
        return { data: user }
    }

    async login(email: string, password: string, session: SessionType) {
        const user = await this.userService.find({ email });
        if (!user) return createFieldError('email', 'No user with this email found')

        const valid = await bcrypt.compare(password, user.hash);
        if (!valid) return createFieldError('password', 'Wrong password credential')

        session.userId = user.id;
        return { data: user };
    }

    async logout(session: SessionType) {
        if (!session.userId) return {
            error: { field: 'userId', message: 'User not logged in' },
            data: false
        }
        session.userId = undefined;
        return { data: true }
    }
}
