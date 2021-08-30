import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;
}

export class UserResponse {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
