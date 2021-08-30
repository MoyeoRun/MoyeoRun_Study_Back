"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OauthModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const kakao_strategy_1 = require("./kakao.strategy");
const oauth_controller_1 = require("./oauth.controller");
const oauth_service_1 = require("./oauth.service");
let OauthModule = class OauthModule {
};
OauthModule = __decorate([
    common_1.Module({
        imports: [users_module_1.UsersModule, auth_module_1.AuthModule, passport_1.PassportModule, axios_1.HttpModule],
        providers: [oauth_service_1.OauthService, kakao_strategy_1.KakaoStrategy],
        controllers: [oauth_controller_1.OauthController],
    })
], OauthModule);
exports.OauthModule = OauthModule;
//# sourceMappingURL=oauth.module.js.map