
import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/User';
import { signInOrRegister } from '../../src/services/auth';

jest.mock('../../src/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue(null),
    destroy: jest.fn().mockResolvedValue(null),
  },
}));

describe('Auth Service', () => {
  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepository);
  });

  // These tests will now make real calls to AWS Cognito.
  // Make sure you have your AWS credentials configured in the .env.docker file.
  describe('signInOrRegister', () => {
    it.skip('should sign in an existing user and return a token', async () => {
      // Arrange
      const username = 'test@example.com';
      const password = 'password';

      // Act
      const token = await signInOrRegister(username, password);

      // Assert
      expect(token).toBeDefined();
    });

    it.skip('should sign up a new user, create a local user, and return a token', async () => {
      // Arrange
      const username = `newuser-${Date.now()}@example.com`;
      const password = 'Password123!';

      // Act
      const token = await signInOrRegister(username, password);

      // Assert
      expect(token).toBeDefined();
    });
  });
});
