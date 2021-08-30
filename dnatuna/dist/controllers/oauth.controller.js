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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OauthController = void 0;
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../decorators/user.decorator");
const oauth_dto_1 = require("../dto/oauth.dto");
const auth_service_1 = require("../services/auth.service");
const kakao_oauth_guard_1 = require("../guards/kakao-oauth.guard");
const oauth_service_1 = require("../services/oauth.service");
let OauthController = class OauthController {
    constructor(oauthService, authService) {
        this.oauthService = oauthService;
        this.authService = authService;
    }
    async kakao(user) {
        return this.oauthService.authentication(user);
    }
};
__decorate([
    common_1.UseGuards(kakao_oauth_guard_1.KakaoOauthGuard),
    common_1.Post('kakao'),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_dto_1.OauthUserRequest]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "kakao", null);
OauthController = __decorate([
    common_1.Controller('oauth'),
    __metadata("design:paramtypes", [oauth_service_1.OauthService,
        auth_service_1.AuthService])
], OauthController);
exports.OauthController = OauthController;
//# sourceMappingURL=oauth.controller.js.map