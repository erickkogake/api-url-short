import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { PrismaService } from '../src/infra/db/prisma/prisma.service';

describe('ShortUrlController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
  });

  beforeEach(async () => {
    await prisma.shortUrl.deleteMany();
  });

  afterAll(async () => {
    await prisma.shortUrl.deleteMany();
    await app.close();
  });

  it('should create a short url', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/shorten')
      .send({
        url: 'https://www.google.com',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        url: 'https://www.google.com',
        shortCode: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('should retrieve original url and increment access count', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/shorten')
      .send({
        url: 'https://www.google.com',
      })
      .expect(201);

    const shortCode = created.body.shortCode;

    await request(app.getHttpServer())
      .get(`/api/shorten/${shortCode}`)
      .expect(200);

    const stats = await request(app.getHttpServer())
      .get(`/api/shorten/${shortCode}/stats`)
      .expect(200);

    expect(stats.body.accessCount).toBe(1);
  });

  it('should update a short url', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/shorten')
      .send({
        url: 'https://www.google.com',
      })
      .expect(201);

    const shortCode = created.body.shortCode;

    const updated = await request(app.getHttpServer())
      .put(`/api/shorten/${shortCode}`)
      .send({
        url: 'https://www.github.com',
      })
      .expect(200);

    expect(updated.body.url).toBe('https://www.github.com');
  });

  it('should delete a short url', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/shorten')
      .send({
        url: 'https://www.google.com',
      })
      .expect(201);

    const shortCode = created.body.shortCode;

    await request(app.getHttpServer())
      .delete(`/api/shorten/${shortCode}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/api/shorten/${shortCode}`)
      .expect(404);
  });

  it('should return 400 for invalid url on create', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/shorten')
      .send({
        url: 'invalid-url',
      })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
  });

  it('should return 404 for stats of non-existing short url', async () => {
    await request(app.getHttpServer())
      .get('/api/shorten/notfound/stats')
      .expect(404);
  });
});