"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KakaoStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_custom_1 = require("passport-custom");
const oauth_dto_1 = require("../dto/oauth.dto");
const oauth_service_1 = require("../services/oauth.service");
let KakaoStrategy = class KakaoStrategy extends passport_1.PassportStrategy(passport_custom_1.Strategy, 'kakao') {
    constructor(oauthService) {
        super();
        this.oauthService = oauthService;
    }
    async validate(req) {
        const user = await this.oauthService.kakaoGetUser(req.body.accessToken);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return {
            name: user.kakao_account.profile.nickname,
            email: user.kakao_account.email,
        };
    }
};
KakaoStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [oauth_service_1.OauthService])
], KakaoStrategy);
exports.KakaoStrategy = KakaoStrategy;
//# sourceMappingURL=kakao.strategy.js.map