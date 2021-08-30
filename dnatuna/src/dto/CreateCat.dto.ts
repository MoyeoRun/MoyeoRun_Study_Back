import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCatRequest {
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  age: number;
}

export class CreateCatResponse {
  @IsString()
  name: string;

  @IsInt()
  age: number;
}
