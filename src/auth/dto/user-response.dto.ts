import { User } from '../user.entity';

export class UserResponseDto extends User {

    accessToken: string;

    static fromUser(user: User, accessToken: string): UserResponseDto {
        const userResponse = new UserResponseDto();

        userResponse.id = user.id;
        userResponse.username = user.username;
        userResponse.accessToken = accessToken;

        return userResponse
    }
}
