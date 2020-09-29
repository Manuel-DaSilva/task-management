import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './auth.repository';
import { User } from './user.entity';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        // this validates the signature of the token
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('jwt.secret'),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        // at this point the payload is already validated from the strategy
        const { id } = payload;

        const user = await this.userRepository.findOne(id);

        // removing password and salt for navigating on the auth decorator
        user.password = '';
        user.salt = '';
        
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
