import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginResponse {
  @IsOptional()
  @IsString()
  accessToken: string;
}
