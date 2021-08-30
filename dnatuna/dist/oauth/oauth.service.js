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
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const axios_2 = require("axios");
const users_service_1 = require("../users/users.service");
let OauthService = class OauthService {
    constructor(usersService, axios) {
        this.usersService = usersService;
        this.axios = axios;
    }
    async kakaoGetUser(accessToken) {
        try {
            const user = await axios_2.default({
                method: 'GET',
                url: 'https://kapi.kakao.com/v2/user/me',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return user.data;
        }
        catch (error) {
            if (axios_2.default.isAxiosError(error)) {
                throw new common_1.HttpException(error.response.data, error.response.status);
            }
            else {
                throw new Error('Wrong Type');
            }
        }
    }
};
OauthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_service_1.UsersService, axios_1.HttpService])
], OauthService);
exports.OauthService = OauthService;
//# sourceMappingURL=oauth.service.js.map