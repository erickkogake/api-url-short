import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateShortUrlUseCase } from '../../app/use-cases/create-short-url.use-case';
import { DeleteShortUrlUseCase } from '../../app/use-cases/delete-short-url.use-case';
import { GetShortUrlStatsUseCase } from '../../app/use-cases/get-short-url-stats.use-case';
import { GetShortUrlUseCase } from '../../app/use-cases/get-short-url.use-case';
import { UpdateShortUrlUseCase } from '../../app/use-cases/update-short-url.use-case';
import { CreateShortUrlDto } from '../dtos/create-short-url.dto';
import { ShortUrlPresenter } from '../presenters/short-url.presenter';
import { UpdateShortUrlDto } from '../dtos/update-short-url.dto';

@ApiTags('Short URLs')
@Controller('shorten')
export class ShortUrlController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly getShortUrlUseCase: GetShortUrlUseCase,
    private readonly getShortUrlStatsUseCase: GetShortUrlStatsUseCase,
    private readonly updateShortUrlUseCase: UpdateShortUrlUseCase,
    private readonly deleteShortUrlUseCase: DeleteShortUrlUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new short URL',
    description: 'Creates a new short URL from a valid original URL',
  })
  @ApiCreatedResponse({
    description: 'Short URL created successfully',
    schema: {
      example: {
        id: '1b5a4c8e-74f0-4c73-b11d-a9d0c1a34b2e',
        url: 'https://www.example.com/some/long/url',
        shortCode: 'abc123',
        createdAt: '2026-03-18T12:00:00.000Z',
        updatedAt: '2026-03-18T12:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
  })
  async create(@Body() body: CreateShortUrlDto) {
    const shortUrl = await this.createShortUrlUseCase.execute({
      url: body.url,
    });

    return ShortUrlPresenter.toHTTP(shortUrl);
  }

  @Get(':shortCode')
  @ApiOperation({
    summary: 'Retrieve original URL by short code',
    description: 'Returns the original URL data and increments access count',
  })
  @ApiParam({
    name: 'shortCode',
    example: 'abc123',
  })
  @ApiOkResponse({
    description: 'Short URL found successfully',
    schema: {
      example: {
        id: '1b5a4c8e-74f0-4c73-b11d-a9d0c1a34b2e',
        url: 'https://www.example.com/some/long/url',
        shortCode: 'abc123',
        createdAt: '2026-03-18T12:00:00.000Z',
        updatedAt: '2026-03-18T12:05:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Short URL not found',
  })
  async findOne(@Param('shortCode') shortCode: string) {
    const shortUrl = await this.getShortUrlUseCase.execute(shortCode);

    return ShortUrlPresenter.toHTTP(shortUrl);
  }

  @Get(':shortCode/stats')
  @ApiOperation({
    summary: 'Retrieve short URL statistics',
    description: 'Returns the short URL data including access count',
  })
  @ApiParam({
    name: 'shortCode',
    example: 'abc123',
  })
  @ApiOkResponse({
    description: 'Short URL stats found successfully',
    schema: {
      example: {
        id: '1b5a4c8e-74f0-4c73-b11d-a9d0c1a34b2e',
        url: 'https://www.example.com/some/long/url',
        shortCode: 'abc123',
        createdAt: '2026-03-18T12:00:00.000Z',
        updatedAt: '2026-03-18T12:05:00.000Z',
        accessCount: 10,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Short URL not found',
  })
  async getStats(@Param('shortCode') shortCode: string) {
    const shortUrl = await this.getShortUrlStatsUseCase.execute(shortCode);

    return ShortUrlPresenter.toHTTPWithStats(shortUrl);
  }

  @Put(':shortCode')
  @ApiOperation({
    summary: 'Update an existing short URL',
    description: 'Updates the original URL associated with a short code',
  })
  @ApiParam({
    name: 'shortCode',
    example: 'abc123',
  })
  @ApiOkResponse({
    description: 'Short URL updated successfully',
    schema: {
      example: {
        id: '1b5a4c8e-74f0-4c73-b11d-a9d0c1a34b2e',
        url: 'https://www.example.com/some/updated/url',
        shortCode: 'abc123',
        createdAt: '2026-03-18T12:00:00.000Z',
        updatedAt: '2026-03-18T12:30:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
  })
  @ApiNotFoundResponse({
    description: 'Short URL not found',
  })
  async update(
    @Param('shortCode') shortCode: string,
    @Body() body: UpdateShortUrlDto,
  ) {
    const shortUrl = await this.updateShortUrlUseCase.execute({
      shortCode,
      url: body.url,
    });

    return ShortUrlPresenter.toHTTP(shortUrl);
  }

  @Delete(':shortCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a short URL',
    description: 'Deletes a short URL by its short code',
  })
  @ApiParam({
    name: 'shortCode',
    example: 'abc123',
  })
  @ApiNoContentResponse({
    description: 'Short URL deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Short URL not found',
  })
  async delete(@Param('shortCode') shortCode: string): Promise<void> {
    await this.deleteShortUrlUseCase.execute(shortCode);
  }
}
