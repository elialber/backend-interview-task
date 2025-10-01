import request from 'supertest';
import Koa from 'koa';
import usersRouter from '../../src/routes/users';
import { authMiddleware } from '../../src/middleware/auth';
import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/User';

jest.mock('../../src/middleware/auth');
jest.mock('../../src/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const app = new Koa();
app.use(usersRouter.routes());

describe('Users E2E', () => {
  const mockUserRepository = {
    find: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockUserRepository,
    );
  });

  it('should allow an admin to get all users', async () => {
    // Arrange
    (authMiddleware as jest.Mock).mockImplementation(async (ctx, next) => {
      ctx.state.user = {
        email: 'admin@example.com',
        'cognito:groups': ['admin'],
      };
      await next();
    });
    const mockUsers = [new User(), new User()];
    mockUserRepository.find.mockResolvedValue(mockUsers);

    // Act
    const response = await request(app.callback()).get('/users');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  it('should not allow a regular user to get all users', async () => {
    // Arrange
    (authMiddleware as jest.Mock).mockImplementation(async (ctx, next) => {
      ctx.state.user = {
        email: 'user@example.com',
        'cognito:groups': ['user'],
      };
      await next();
    });

    // Act
    const response = await request(app.callback()).get('/users');

    // Assert
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Only admins can access this route',
    });
  });
});
