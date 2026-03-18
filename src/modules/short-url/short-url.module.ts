import { Module } from '@nestjs/common';
import { CreateShortUrlUseCase } from './app/use-cases/create-short-url.use-case';
import { RandomShortCodeGeneratorService } from './infra/services/random-short-code-generator.service';

@Module({
  providers: [
    CreateShortUrlUseCase,
    {
      provide: 'ShortCodeGeneratorService',
      useClass: RandomShortCodeGeneratorService,
    },
  ],
  exports: [CreateShortUrlUseCase],
})
export class ShortUrlModule {}
