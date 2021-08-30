import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from 'src/dto/auth.dto';
import { UserResponse } from 'src/dto/user.dto';
import { UserService } from './user.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    validateUser(loginRequest: LoginRequest): Promise<UserResponse | null>;
    login(user: UserResponse): Promise<{
        accessToken: string;
    }>;
}
