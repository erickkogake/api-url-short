import { ShortCodeGenerationException } from '../../../../../common/exceptions/short-code-generation.exception';
import { ShortUrlRepository } from '../../../domain/repositories/short-url.repository';
import { ShortCodeGeneratorService } from '../../../domain/services/short-code-generator.service';
import { CreateShortUrlUseCase } from '../create-short-url.use-case';

describe('CreateShortUrlUseCase', () => {
  let useCase: CreateShortUrlUseCase;
  let repository: jest.Mocked<ShortUrlRepository>;
  let generator: jest.Mocked<ShortCodeGeneratorService>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByShortCode: jest.fn(),
      existsByShortCode: jest.fn(),
      updateUrl: jest.fn(),
      deleteByShortCode: jest.fn(),
      incrementAccessCount: jest.fn(),
    };

    generator = {
      generate: jest.fn(),
    };

    useCase = new CreateShortUrlUseCase(repository, generator);
  });

  it('should create a short url with unique code', async () => {
    const generateMock = generator.generate.mockReturnValue('abc123');
    const existsMock = repository.existsByShortCode.mockResolvedValue(false);
    const createMock = repository.create.mockResolvedValue({
      id: '1',
      url: 'https://google.com',
      shortCode: 'abc123',
      accessCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      updateUrl: jest.fn(),
      registerAccess: jest.fn(),
    });

    const result = await useCase.execute({
      url: 'https://google.com',
    });

    expect(generateMock).toHaveBeenCalledWith(6);
    expect(existsMock).toHaveBeenCalledWith('abc123');
    expect(createMock).toHaveBeenCalledWith({
      url: 'https://google.com',
      shortCode: 'abc123',
    });
    expect(result.shortCode).toBe('abc123');
  });

  it('should retry when generated code already exists', async () => {
    const generateMock = generator.generate
      .mockReturnValueOnce('abc123')
      .mockReturnValueOnce('xyz789');

    repository.existsByShortCode
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const createMock = repository.create.mockResolvedValue({
      id: '1',
      url: 'https://google.com',
      shortCode: 'xyz789',
      accessCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      updateUrl: jest.fn(),
      registerAccess: jest.fn(),
    });

    const result = await useCase.execute({
      url: 'https://google.com',
    });

    expect(generateMock).toHaveBeenCalledTimes(2);
    expect(createMock).toHaveBeenCalledWith({
      url: 'https://google.com',
      shortCode: 'xyz789',
    });
    expect(result.shortCode).toBe('xyz789');
  });

  it('should throw when unable to generate unique code', async () => {
    const generateMock = generator.generate.mockReturnValue('abc123');
    repository.existsByShortCode.mockResolvedValue(true);

    await expect(
      useCase.execute({ url: 'https://google.com' }),
    ).rejects.toBeInstanceOf(ShortCodeGenerationException);

    expect(generateMock).toHaveBeenCalledTimes(5);
  });
});
