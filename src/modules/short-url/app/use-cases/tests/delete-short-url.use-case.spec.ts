import { ResourceNotFoundException } from '../../../../../common/exceptions/resource-not-found.exception';
import { ShortUrlRepository } from '../../../domain/repositories/short-url.repository';
import { DeleteShortUrlUseCase } from '../delete-short-url.use-case';

describe('DeleteShortUrlUseCase', () => {
  let useCase: DeleteShortUrlUseCase;
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

    useCase = new DeleteShortUrlUseCase(repository);
  });

  it('should delete short url when it exists', async () => {
    const deleteMock = repository.deleteByShortCode.mockResolvedValue(true);

    await expect(useCase.execute('abc123')).resolves.toBeUndefined();

    expect(deleteMock).toHaveBeenCalledWith('abc123');
  });

  it('should throw when short url does not exist', async () => {
    const deleteMock = repository.deleteByShortCode.mockResolvedValue(false);

    await expect(useCase.execute('abc123')).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );

    expect(deleteMock).toHaveBeenCalledWith('abc123');
  });
});
