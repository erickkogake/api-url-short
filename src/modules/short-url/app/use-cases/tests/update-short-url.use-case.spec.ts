import { ResourceNotFoundException } from '../../../../../common/exceptions/resource-not-found.exception';
import { ShortUrlRepository } from '../../../domain/repositories/short-url.repository';
import { UpdateShortUrlUseCase } from '../update-short-url.use-case';

describe('UpdateShortUrlUseCase', () => {
  let useCase: UpdateShortUrlUseCase;
  let repository: jest.Mocked<ShortUrlRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByShortCode: jest.fn(),
      existsByShortCode: jest.fn(),
      updateUrl: jest.fn(),
      deleteByShortCode: jest.fn(),
      incrementAccessCount: jest.fn(),
    };

    useCase = new UpdateShortUrlUseCase(repository);
  });

  it('should update short url when it exists', async () => {
    const updateUrlMock = repository.updateUrl.mockResolvedValue({
      id: '1',
      url: 'https://updated.com',
      shortCode: 'abc123',
      accessCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      updateUrl: jest.fn(),
      registerAccess: jest.fn(),
    });

    const result = await useCase.execute({
      shortCode: 'abc123',
      url: 'https://updated.com',
    });

    expect(updateUrlMock).toHaveBeenCalledWith('abc123', 'https://updated.com');
    expect(result.url).toBe('https://updated.com');
  });

  it('should throw when short url does not exist', async () => {
    const updateUrlMock = repository.updateUrl.mockResolvedValue(null);

    await expect(
      useCase.execute({
        shortCode: 'abc123',
        url: 'https://updated.com',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundException);

    expect(updateUrlMock).toHaveBeenCalledWith('abc123', 'https://updated.com');
  });
});
