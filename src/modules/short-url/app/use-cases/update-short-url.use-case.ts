import { Inject, Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../../common/exceptions/resource-not-found.exception';
import { ShortUrlEntity } from '../../domain/entities/short-url.entity';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';

type UpdateShortUrlInput = {
  shortCode: string;
  url: string;
};

@Injectable()
export class UpdateShortUrlUseCase {
  constructor(
    @Inject('ShortUrlRepository')
    private readonly shortUrlRepository: ShortUrlRepository,
  ) {}

  async execute(input: UpdateShortUrlInput): Promise<ShortUrlEntity> {
    const updated = await this.shortUrlRepository.updateUrl(
      input.shortCode,
      input.url,
    );

    if (!updated) {
      throw new ResourceNotFoundException('Short URL');
    }

    return updated;
  }
}