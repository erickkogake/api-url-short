import { ShortUrlEntity } from '../../domain/entities/short-url.entity';

export class ShortUrlPresenter {
  static toHTTP(entity: ShortUrlEntity) {
    return {
      id: entity.id,
      url: entity.url,
      shortCode: entity.shortCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toHTTPWithStats(entity: ShortUrlEntity) {
    return {
      id: entity.id,
      url: entity.url,
      shortCode: entity.shortCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      accessCount: entity.accessCount,
    };
  }
}
