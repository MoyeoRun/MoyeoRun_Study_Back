import { CreateUserRequest, UserResponse } from 'src/dto/user.dto';
import { UserService } from 'src/services/user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    signup(createUserRequest: CreateUserRequest): Promise<UserResponse>;
    getProfile(user: UserResponse): UserResponse;
}
