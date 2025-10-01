import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import editAccountRouter from '../../src/routes/edit-account';
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
app.use(bodyParser());
app.use(editAccountRouter.routes());

describe('Edit Account E2E', () => {
  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockUserRepository,
    );
  });

  it('should allow an admin to update name and role', async () => {
    // Arrange
    (authMiddleware as jest.Mock).mockImplementation(async (ctx, next) => {
      ctx.state.user = {
        email: 'admin@example.com',
        'cognito:groups': ['admin'],
      };
      await next();
    });
    const mockUser = new User();
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    // Act
    const response = await request(app.callback())
      .put('/edit-account')
      .send({ name: 'New Name', role: 'admin' });

    // Assert
    expect(response.status).toBe(200);
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Name', role: 'admin' }),
    );
  });

  it('should allow an admin to update name only', async () => {
    // Arrange
    (authMiddleware as jest.Mock).mockImplementation(async (ctx, next) => {
      ctx.state.user = {
        email: 'admin@example.com',
        'cognito:groups': ['admin'],
      };
      await next();
    });
    const mockUser = new User();
    mockUser.role = 'user';
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    // Act
    const response = await request(app.callback())
      .put('/edit-account')
      .send({ name: 'New Name' });

    // Assert
    expect(response.status).toBe(200);
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Name', role: 'user' }),
    );
  });

  it('should allow an admin to update role only', async () => {
    // Arrange
    (authMiddleware as jest.Mock).mockImplementation(async (ctx, next) => {
      ctx.state.user = {
        email: 'admin@example.com',
        'cognito:groups': ['admin'],
      };
      await next();
    });
    const mockUser = new User();
    mockUser.name = 'Old Name';
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    // Act
    const response = await request(app.callback())
      .put('/edit-account')
      .send({ role: 'admin' });

    // Assert
    expect(response.status).toBe(200);
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Old Name', role: 'admin' }),
    );
  });

  it('should allow a user to update their name and set isOnboarded to true', async () => {
    // Arrange
    (authMiddleware as jest.Mock).mockImplementation(async (ctx, next) => {
      ctx.state.user = {
        email: 'user@example.com',
        'cognito:groups': ['user'],
      };
      await next();
    });
    const mockUser = new User();
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    // Act
    const response = await request(app.callback())
      .put('/edit-account')
      .send({ name: 'New Name' });

    // Assert
    expect(response.status).toBe(200);
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Name', isOnboarded: true }),
    );
  });

  it('should not allow a user to update their role', async () => {
    // Arrange
    (authMiddleware as jest.Mock).mockImplementation(async (ctx, next) => {
      ctx.state.user = {
        email: 'user@example.com',
        'cognito:groups': ['user'],
      };
      await next();
    });
    const mockUser = new User();
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    // Act
    const response = await request(app.callback())
      .put('/edit-account')
      .send({ role: 'admin' });

    // Assert
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Only admins can change the role',
    });
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should return 404 if user is not found', async () => {
    // Arrange
    (authMiddleware as jest.Mock).mockImplementation(async (ctx, next) => {
      ctx.state.user = {
        email: 'notfound@example.com',
        'cognito:groups': ['user'],
      };
      await next();
    });
    mockUserRepository.findOne.mockResolvedValue(null);

    // Act
    const response = await request(app.callback())
      .put('/edit-account')
      .send({ name: 'New Name' });

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});