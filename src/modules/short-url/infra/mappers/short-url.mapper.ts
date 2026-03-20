import { ShortUrl } from 'src/generated/prisma/client';
import { ShortUrlEntity } from '../../domain/entities/short-url.entity';

export class ShortUrlMapper {
  static toDomain(raw: ShortUrl): ShortUrlEntity {
    return new ShortUrlEntity(
      raw.id,
      raw.url,
      raw.shortCode,
      raw.accessCount,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
