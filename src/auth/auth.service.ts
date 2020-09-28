import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {

        return this.userRepository.signUp(authCredentialsDto);
    }

    async signin(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {

        const username = await this.userRepository.validateUSerPassword(authCredentialsDto);
        
        if (!username) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload: JwtPayload = { username };

        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }
}
