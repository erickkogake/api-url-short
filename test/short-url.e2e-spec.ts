import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { PrismaService } from '../src/infra/db/prisma/prisma.service';

type CreateShortUrlResponse = {
  id: string;
  url: string;
  shortCode: string;
  accessCount?: number;
  createdAt: string;
  updatedAt: string;
};

type StatsResponse = {
  id: string;
  url: string;
  shortCode: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
};

type ErrorResponse = {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
};

describe('ShortUrlController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: App;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

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

    server = app.getHttpServer() as App;
  });

  beforeEach(async () => {
    await prisma.shortUrl.deleteMany();
  });

  afterAll(async () => {
    await prisma.shortUrl.deleteMany();
    await app.close();
  });

  it('should create a short url', async () => {
    const response = await request(server)
      .post('/api/shorten')
      .send({
        url: 'https://www.google.com',
      })
      .expect(201);

    const body = response.body as CreateShortUrlResponse;

    expect(body.id).toEqual(expect.any(String));
    expect(body.url).toBe('https://www.google.com');
    expect(body.shortCode).toEqual(expect.any(String));
    expect(body.createdAt).toEqual(expect.any(String));
    expect(body.updatedAt).toEqual(expect.any(String));
  });

  it('should retrieve original url and increment access count', async () => {
    const createdResponse = await request(server)
      .post('/api/shorten')
      .send({
        url: 'https://www.google.com',
      })
      .expect(201);

    const created = createdResponse.body as CreateShortUrlResponse;
    const shortCode = created.shortCode;

    await request(server).get(`/api/shorten/${shortCode}`).expect(200);

    const statsResponse = await request(server)
      .get(`/api/shorten/${shortCode}/stats`)
      .expect(200);

    const stats = statsResponse.body as StatsResponse;

    expect(stats.accessCount).toBe(1);
  });

  it('should update a short url', async () => {
    const createdResponse = await request(server)
      .post('/api/shorten')
      .send({
        url: 'https://www.google.com',
      })
      .expect(201);

    const created = createdResponse.body as CreateShortUrlResponse;
    const shortCode = created.shortCode;

    const updatedResponse = await request(server)
      .put(`/api/shorten/${shortCode}`)
      .send({
        url: 'https://www.github.com',
      })
      .expect(200);

    const updated = updatedResponse.body as CreateShortUrlResponse;

    expect(updated.url).toBe('https://www.github.com');
  });

  it('should delete a short url', async () => {
    const createdResponse = await request(server)
      .post('/api/shorten')
      .send({
        url: 'https://www.google.com',
      })
      .expect(201);

    const created = createdResponse.body as CreateShortUrlResponse;
    const shortCode = created.shortCode;

    await request(server).delete(`/api/shorten/${shortCode}`).expect(204);

    await request(server).get(`/api/shorten/${shortCode}`).expect(404);
  });

  it('should return 400 for invalid url on create', async () => {
    const response = await request(server)
      .post('/api/shorten')
      .send({
        url: 'invalid-url',
      })
      .expect(400);

    const body = response.body as ErrorResponse;

    expect(body.statusCode).toBe(400);
  });

  it('should return 404 for stats of non-existing short url', async () => {
    await request(server).get('/api/shorten/notfound/stats').expect(404);
  });
});
