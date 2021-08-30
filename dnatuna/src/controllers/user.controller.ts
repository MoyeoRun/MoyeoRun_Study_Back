import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { CreateUserRequest, UserResponse } from 'src/dto/user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signup(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<UserResponse> {
    return this.userService.create(createUserRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: UserResponse) {
    return user;
  }
}
