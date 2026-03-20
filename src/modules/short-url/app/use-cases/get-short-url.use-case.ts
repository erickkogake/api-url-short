import { Inject, Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../../common/exceptions/resource-not-found.exception';
import { ShortUrlEntity } from '../../domain/entities/short-url.entity';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';

@Injectable()
export class GetShortUrlUseCase {
  constructor(
    @Inject('ShortUrlRepository')
    private readonly shortUrlRepository: ShortUrlRepository,
  ) {}

  async execute(shortCode: string): Promise<ShortUrlEntity> {
    const shortUrl = await this.shortUrlRepository.findByShortCode(shortCode);

    if (!shortUrl) {
      throw new ResourceNotFoundException('Short URL');
    }

    await this.shortUrlRepository.incrementAccessCount(shortCode);

    const updatedShortUrl =
      await this.shortUrlRepository.findByShortCode(shortCode);

    if (!updatedShortUrl) {
      throw new ResourceNotFoundException('Short URL');
    }

    return updatedShortUrl;
  }
}
