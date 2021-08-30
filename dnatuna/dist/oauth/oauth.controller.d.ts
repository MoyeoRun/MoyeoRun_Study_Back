import { AuthService } from 'src/auth/auth.service';
import { OauthService } from './oauth.service';
export declare class OauthController {
    private oauthService;
    private authService;
    constructor(oauthService: OauthService, authService: AuthService);
    kakao(req: any): Promise<any>;
}
