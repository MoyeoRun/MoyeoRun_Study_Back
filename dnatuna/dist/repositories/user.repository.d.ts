import { Prisma, User } from '@prisma/client';
import { CreateUserRequest } from 'src/dto/user.dto';
import { PrismaService } from 'src/services/prisma.service';
export declare class UserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserRequest: CreateUserRequest): Promise<User>;
    findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null>;
}
