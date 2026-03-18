import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { HealthModule } from './modules/health/health.module';
import { ShortUrlModule } from './modules/short-url/short-url.module';
import { PrismaModule } from './infra/db/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    PrismaModule,
    HealthModule,
    ShortUrlModule,
  ],
})
export class AppModule {}