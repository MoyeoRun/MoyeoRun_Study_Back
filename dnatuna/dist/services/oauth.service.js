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
exports.OauthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const auth_dto_1 = require("../dto/auth.dto");
const oauth_dto_1 = require("../dto/oauth.dto");
const user_dto_1 = require("../dto/user.dto");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("./user.service");
let OauthService = class OauthService {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async kakaoGetUser(accessToken) {
        try {
            const user = await axios_1.default({
                method: 'GET',
                url: 'https://kapi.kakao.com/v2/user/me',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return user.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new common_1.HttpException(error.response.data, error.response.status);
            }
            else {
                throw new common_1.HttpException('Wrong Type', 500);
            }
        }
    }
    async authentication(oauthUserRequest) {
        try {
            let user = await this.userService.findByEmail({
                email: oauthUserRequest.email,
            });
            if (user == undefined) {
                user = await this.userService.create(oauthUserRequest);
            }
            return this.authService.login(user);
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('<Oauth> Server Error', 500);
        }
    }
};
OauthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], OauthService);
exports.OauthService = OauthService;
//# sourceMappingURL=oauth.service.js.map