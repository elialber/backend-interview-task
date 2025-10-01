import {
  CognitoIdentityProvider,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/User';
import { signInOrRegister } from '../../src/services/auth';

// Mock AppDataSource
jest.mock('../../src/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue(null),
    destroy: jest.fn().mockResolvedValue(null),
  },
}));

const mockCognito = new CognitoIdentityProvider({});

describe('Auth Service', () => {
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

  describe('signInOrRegister', () => {
    it('should sign in an existing user and return a token', async () => {
      // Arrange
      const username = 'test@example.com';
      const password = 'password';
      const mockAuthResponse = {
        AuthenticationResult: {
          AccessToken: 'access-token',
          IdToken: 'id-token',
        },
      };
      const mockUserDetails = {
        UserAttributes: [{ Name: 'email', Value: username }],
      };
      (mockCognito.initiateAuth as jest.Mock).mockResolvedValue(
        mockAuthResponse,
      );
      (mockCognito.getUser as jest.Mock).mockResolvedValue(mockUserDetails);

      const mockUser = new User();
      mockUser.email = username;
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const token = await signInOrRegister(username, password);

      // Assert
      expect(token).toBe('id-token');
      expect(mockCognito.initiateAuth).toHaveBeenCalledWith({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.COGNITO_CLIENT_ID || '',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should sign up a new user, create a local user, and return a token', async () => {
      // Arrange
      const username = 'new@example.com';
      const password = 'password';
      (mockCognito.initiateAuth as jest.Mock).mockRejectedValueOnce(
        new UserNotFoundException({ message: 'User not found', $metadata: {} }),
      );
      (mockCognito.signUp as jest.Mock).mockResolvedValue({});
      (mockCognito.adminConfirmSignUp as jest.Mock).mockResolvedValue({});
      const mockAuthResponse = {
        AuthenticationResult: {
          AccessToken: 'access-token',
          IdToken: 'id-token',
        },
      };
      const mockUserDetails = {
        UserAttributes: [{ Name: 'email', Value: username }],
      };
      (mockCognito.initiateAuth as jest.Mock).mockResolvedValue(
        mockAuthResponse,
      );
      (mockCognito.getUser as jest.Mock).mockResolvedValue(mockUserDetails);

      mockUserRepository.findOne.mockResolvedValue(null);

      // Act
      const token = await signInOrRegister(username, password);

      // Assert
      expect(token).toBe('id-token');
      expect(mockCognito.signUp).toHaveBeenCalledWith({
        ClientId: process.env.COGNITO_CLIENT_ID || '',
        Username: username,
        Password: password,
        UserAttributes: [{ Name: 'email', Value: username }],
      });
      expect(mockCognito.adminConfirmSignUp).toHaveBeenCalledWith({
        UserPoolId: process.env.COGNITO_USER_POOL_ID || '',
        Username: username,
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });
});
