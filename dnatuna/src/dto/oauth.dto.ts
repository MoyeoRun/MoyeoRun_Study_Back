import { IsEmail, IsString } from 'class-validator';

export class OauthRequest {
  @IsString()
  accessToken: string;
}

export class OauthUserRequest {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
