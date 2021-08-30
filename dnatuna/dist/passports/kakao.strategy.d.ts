import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { OauthUserRequest } from 'src/dto/oauth.dto';
import { OauthService } from '../services/oauth.service';
declare const KakaoStrategy_base: new (...args: any[]) => Strategy;
export declare class KakaoStrategy extends KakaoStrategy_base {
    private oauthService;
    constructor(oauthService: OauthService);
    validate(req: Request): Promise<OauthUserRequest>;
}
export {};
