import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { LoginResponse } from 'src/dto/auth.dto';
import { OauthUserRequest } from 'src/dto/oauth.dto';
import { UserResponse } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable()
export class OauthService {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async kakaoGetUser(accessToken: any) {
    try {
      const user = await axios({
        method: 'GET',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return user.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException('Wrong Type', 500);
      }
    }
  }

  async authentication(
    oauthUserRequest: OauthUserRequest,
  ): Promise<LoginResponse> {
    try {
      let user: UserResponse = await this.userService.findByEmail({
        email: oauthUserRequest.email,
      });
      if (user == undefined) {
        user = await this.userService.create(oauthUserRequest);
      }

      return this.authService.login(user);
    } catch (error: any) {
      console.error(error);
      throw new HttpException('<Oauth> Server Error', 500);
    }
  }
}
