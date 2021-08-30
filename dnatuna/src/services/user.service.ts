import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from 'src/repositories/user.repository';
import { CreateUserRequest } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserRequest: CreateUserRequest): Promise<User> {
    return this.userRepository.create(createUserRequest);
  }

  async findByEmail(email: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.userRepository.findOne(email);
  }
}
