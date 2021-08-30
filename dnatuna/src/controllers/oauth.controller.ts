import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { OauthUserRequest } from 'src/dto/oauth.dto';
import { AuthService } from 'src/services/auth.service';
import { KakaoOauthGuard } from '../guards/kakao-oauth.guard';
import { OauthService } from '../services/oauth.service';

@Controller('oauth')
export class OauthController {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  @UseGuards(KakaoOauthGuard)
  @Post('kakao')
  async kakao(@User() user: OauthUserRequest) {
    return this.oauthService.authentication(user);
  }
}
