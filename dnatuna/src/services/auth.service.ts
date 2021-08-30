import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from 'src/dto/auth.dto';
import { UserResponse } from 'src/dto/user.dto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginRequest: LoginRequest): Promise<UserResponse | null> {
    const user = await this.usersService.findByEmail({
      email: loginRequest.email,
    });
    if (user && user.password === loginRequest.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserResponse) {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }
}
