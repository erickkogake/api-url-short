import { Inject, Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../../common/exceptions/resource-not-found.exception';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';

@Injectable()
export class DeleteShortUrlUseCase {
  constructor(
    @Inject('ShortUrlRepository')
    private readonly shortUrlRepository: ShortUrlRepository,
  ) {}

  async execute(shortCode: string): Promise<void> {
    const deleted =
      await this.shortUrlRepository.deleteByShortCode(shortCode);

    if (!deleted) {
      throw new ResourceNotFoundException('Short URL');
    }
  }
}