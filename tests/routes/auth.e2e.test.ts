import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import authRouter from '../../src/routes/auth';
import { signInOrRegister } from '../../src/services/auth';

jest.mock('../../src/services/auth');

const app = new Koa();
app.use(bodyParser());
app.use(authRouter.routes());

describe('Auth E2E', () => {
  it('should return a token for valid credentials', async () => {
    // Arrange
    const username = 'test@example.com';
    const password = 'password';
    const mockToken = 'mock-id-token';
    (signInOrRegister as jest.Mock).mockResolvedValue(mockToken);

    // Act
    const response = await request(app.callback())
      .post('/auth')
      .send({ username, password });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: mockToken });
  });

  it('should return 400 for missing credentials', async () => {
    // Act
    const response = await request(app.callback()).post('/auth').send({});

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Username and password are required',
    });
  });
});
