import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {

        return this.authService.signUp(authCredentialsDto);
    }
    
    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<UserResponseDto> {
        return this.authService.signin(authCredentialsDto);
    }
}
