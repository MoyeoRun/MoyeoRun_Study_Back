import { Module } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { UserService } from '../services/user.service';
import { UserController } from './../controllers/user.controller';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule.import([UserRepository])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
