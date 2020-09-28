import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    username: string;
    
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
            message: 'Password too week'
        }
    )
    password: string;
}
