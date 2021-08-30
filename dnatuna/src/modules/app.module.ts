import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { CatsModule } from './cats.module';
import { OauthModule } from './oauth.module';

@Module({
  imports: [AuthModule, CatsModule, OauthModule],
})
export class AppModule {}
