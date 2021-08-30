import { LoginResponse } from 'src/dto/auth.dto';
import { OauthUserRequest } from 'src/dto/oauth.dto';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
export declare class OauthService {
    private userService;
    private authService;
    constructor(userService: UserService, authService: AuthService);
    kakaoGetUser(accessToken: any): Promise<any>;
    authentication(oauthUserRequest: OauthUserRequest): Promise<LoginResponse>;
}
