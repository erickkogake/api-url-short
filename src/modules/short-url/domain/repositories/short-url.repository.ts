import { ShortUrlEntity } from '../entities/short-url.entity';

export abstract class ShortUrlRepository {
  abstract create(data: {
    url: string;
    shortCode: string;
  }): Promise<ShortUrlEntity>;

  abstract findByShortCode(shortCode: string): Promise<ShortUrlEntity | null>;

  abstract existsByShortCode(shortCode: string): Promise<boolean>;

  abstract updateUrl(
    shortCode: string,
    url: string,
  ): Promise<ShortUrlEntity | null>;

  abstract deleteByShortCode(shortCode: string): Promise<boolean>;

  abstract incrementAccessCount(shortCode: string): Promise<void>;
}