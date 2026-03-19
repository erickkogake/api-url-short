import { Module } from '@nestjs/common';
import { CreateShortUrlUseCase } from './app/use-cases/create-short-url.use-case';
import { DeleteShortUrlUseCase } from './app/use-cases/delete-short-url.use-case';
import { GetShortUrlStatsUseCase } from './app/use-cases/get-short-url-stats.use-case';
import { GetShortUrlUseCase } from './app/use-cases/get-short-url.use-case';
import { UpdateShortUrlUseCase } from './app/use-cases/update-short-url.use-case';
import { PrismaShortUrlRepository } from './infra/repositories/prisma-short-url.repository';
import { RandomShortCodeGeneratorService } from './infra/services/random-short-code-generator.service';
import { ShortUrlController } from './presentation/controllers/short-url.controller';

@Module({
  controllers: [ShortUrlController],
  providers: [
    CreateShortUrlUseCase,
    GetShortUrlUseCase,
    GetShortUrlStatsUseCase,
    UpdateShortUrlUseCase,
    DeleteShortUrlUseCase,
    {
      provide: 'ShortUrlRepository',
      useClass: PrismaShortUrlRepository,
    },
    {
      provide: 'ShortCodeGeneratorService',
      useClass: RandomShortCodeGeneratorService,
    },
  ],
  exports: [
    CreateShortUrlUseCase,
    GetShortUrlUseCase,
    GetShortUrlStatsUseCase,
    UpdateShortUrlUseCase,
    DeleteShortUrlUseCase,
  ],
})
export class ShortUrlModule {}