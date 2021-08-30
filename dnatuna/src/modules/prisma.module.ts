import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  providers: [PrismaService],
})
export class PrismaModule {
  static import(repositories = []): DynamicModule {
    return {
      module: PrismaModule,
      providers: repositories,
      exports: repositories,
    };
  }
}
