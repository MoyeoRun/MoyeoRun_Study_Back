import { Prisma, User } from '@prisma/client';
import { UserRepository } from 'src/repositories/user.repository';
import { CreateUserRequest } from '../dto/user.dto';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    create(createUserRequest: CreateUserRequest): Promise<User>;
    findByEmail(email: Prisma.UserWhereUniqueInput): Promise<User | null>;
}
