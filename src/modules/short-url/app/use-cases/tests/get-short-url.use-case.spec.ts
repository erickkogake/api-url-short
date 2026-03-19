import { ResourceNotFoundException } from '../../../../../common/exceptions/resource-not-found.exception';
import { ShortUrlRepository } from '../../../domain/repositories/short-url.repository';
import { GetShortUrlUseCase } from '../get-short-url.use-case';

describe('GetShortUrlUseCase', () => {
  let useCase: GetShortUrlUseCase;
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

    useCase = new GetShortUrlUseCase(repository);
  });

  it('should return short url and increment access count', async () => {
    repository.findByShortCode
      .mockResolvedValueOnce({
        id: '1',
        url: 'https://google.com',
        shortCode: 'abc123',
        accessCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        updateUrl: jest.fn(),
        registerAccess: jest.fn(),
      })
      .mockResolvedValueOnce({
        id: '1',
        url: 'https://google.com',
        shortCode: 'abc123',
        accessCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        updateUrl: jest.fn(),
        registerAccess: jest.fn(),
      });

    repository.incrementAccessCount.mockResolvedValue();

    const result = await useCase.execute('abc123');

    expect(repository.incrementAccessCount).toHaveBeenCalledWith('abc123');
    expect(result.accessCount).toBe(1);
  });

  it('should throw when short url does not exist', async () => {
    repository.findByShortCode.mockResolvedValue(null);

    await expect(useCase.execute('abc123')).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
  });
});