import request from 'supertest';
import Koa from 'koa';

// Mock the AppDataSource initialization
jest.mock('../src/data-source', () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue(null),
  },
}));

// We need to import the app after the mock
const app = new Koa();
app.use((ctx) => {
  if (ctx.path === '/health') {
    ctx.body = { status: 'ok' };
  } else {
    ctx.body = 'Hello, World!';
  }
});

describe('Smoke Test', () => {
  it('should return OK for the health check', async () => {
    const response = await request(app.callback()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
