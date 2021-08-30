import { LoginResponse } from 'src/dto/auth.dto';
import { UserResponse } from 'src/dto/user.dto';
import { UserService } from 'src/services/user.service';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    login(user: UserResponse): Promise<LoginResponse>;
}
