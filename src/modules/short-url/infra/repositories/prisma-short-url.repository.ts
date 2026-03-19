import { Injectable } from '@nestjs/common';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';
import { ShortUrlEntity } from '../../domain/entities/short-url.entity';
import { ShortUrlMapper } from '../mappers/short-url.mapper';
import { PrismaService } from '../../../../infra/db/prisma/prisma.service';

@Injectable()
export class PrismaShortUrlRepository implements ShortUrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    url: string;
    shortCode: string;
  }): Promise<ShortUrlEntity> {
    const created = await this.prisma.shortUrl.create({
      data: {
        url: data.url,
        shortCode: data.shortCode,
      },
    });

    return ShortUrlMapper.toDomain(created);
  }

  async findByShortCode(shortCode: string): Promise<ShortUrlEntity | null> {
    const found = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!found) return null;

    return ShortUrlMapper.toDomain(found);
  }

  async existsByShortCode(shortCode: string): Promise<boolean> {
    const found = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
      select: { id: true },
    });

    return !!found;
  }

  async updateUrl(
    shortCode: string,
    url: string,
  ): Promise<ShortUrlEntity | null> {
    const found = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!found) return null;

    const updated = await this.prisma.shortUrl.update({
      where: { shortCode },
      data: { url },
    });

    return ShortUrlMapper.toDomain(updated);
  }

  async deleteByShortCode(shortCode: string): Promise<boolean> {
    const found = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
      select: { id: true },
    });

    if (!found) return false;

    await this.prisma.shortUrl.delete({
      where: { shortCode },
    });

    return true;
  }

  async incrementAccessCount(shortCode: string): Promise<void> {
    await this.prisma.shortUrl.update({
      where: { shortCode },
      data: {
        accessCount: {
          increment: 1,
        },
      },
    });
  }
}