import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { LoginResponse } from 'src/dto/auth.dto';
import { UserResponse } from 'src/dto/user.dto';
import { UserService } from 'src/services/user.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserResponse): Promise<LoginResponse> {
    return this.authService.login(user);
  }
}
