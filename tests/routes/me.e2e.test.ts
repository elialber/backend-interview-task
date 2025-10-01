import request from 'supertest';
import Koa from 'koa';
import meRouter from '../../src/routes/me';
import { authMiddleware } from '../../src/middleware/auth';

jest.mock('../../src/middleware/auth', () => ({
  authMiddleware: jest.fn(async (ctx, next) => {
    ctx.state.user = { email: 'test@example.com', 'cognito:groups': ['user'] };
    await next();
  }),
}));

const app = new Koa();
app.use(meRouter.routes());

describe('Me E2E', () => {
  it('should return the user from the context', async () => {
    // Act
    const response = await request(app.callback()).get('/me');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ email: 'test@example.com', 'cognito:groups': ['user'] });
  });
});