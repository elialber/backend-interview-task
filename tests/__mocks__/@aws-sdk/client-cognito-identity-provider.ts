const mockCognito = {
  initiateAuth: jest.fn(),
  getUser: jest.fn(),
  signUp: jest.fn(),
  adminConfirmSignUp: jest.fn(),
};

export const CognitoIdentityProvider = jest.fn(() => mockCognito);
export class UserNotFoundException extends Error {}