import { OauthUserRequest } from 'src/dto/oauth.dto';
import { AuthService } from 'src/services/auth.service';
import { OauthService } from '../services/oauth.service';
export declare class OauthController {
    private oauthService;
    private authService;
    constructor(oauthService: OauthService, authService: AuthService);
    kakao(user: OauthUserRequest): Promise<import("../dto/auth.dto").LoginResponse>;
}
