import { Inject, Injectable, Logger } from '@nestjs/common';
import { ShortUrlEntity } from '../../domain/entities/short-url.entity';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';
import { ShortCodeGeneratorService } from '../../domain/services/short-code-generator.service';
import { ShortCodeGenerationException } from '../../../../common/exceptions/short-code-generation.exception';

type CreateShortUrlInput = {
  url: string;
};

@Injectable()
export class CreateShortUrlUseCase {
  private readonly logger = new Logger(CreateShortUrlUseCase.name);
  private readonly maxRetries = 5;

  constructor(
    @Inject('ShortUrlRepository')
    private readonly shortUrlRepository: ShortUrlRepository,

    @Inject('ShortCodeGeneratorService')
    private readonly shortCodeGeneratorService: ShortCodeGeneratorService,
  ) {}

  async execute(input: CreateShortUrlInput): Promise<ShortUrlEntity> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      const shortCode = this.shortCodeGeneratorService.generate(6);
      const alreadyExists =
        await this.shortUrlRepository.existsByShortCode(shortCode);

      if (!alreadyExists) {
        return this.shortUrlRepository.create({
          url: input.url,
          shortCode,
        });
      }

      this.logger.warn(`Conflito de código curto ${attempt}: ${shortCode}`);
    }

    throw new ShortCodeGenerationException();
  }
}
