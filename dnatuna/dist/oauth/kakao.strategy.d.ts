import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { OauthService } from './oauth.service';
declare const KakaoStrategy_base: new (...args: any[]) => Strategy;
export declare class KakaoStrategy extends KakaoStrategy_base {
    private oauthService;
    constructor(oauthService: OauthService);
    validate(req: Request): Promise<any>;
}
export {};
