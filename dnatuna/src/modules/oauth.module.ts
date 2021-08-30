import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/modules/auth.module';
import { OauthController } from '../controllers/oauth.controller';
import { KakaoStrategy } from '../passports/kakao.strategy';
import { OauthService } from '../services/oauth.service';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule, AuthModule, PassportModule, HttpModule],
  providers: [OauthService, KakaoStrategy],
  controllers: [OauthController],
})
export class OauthModule {}
