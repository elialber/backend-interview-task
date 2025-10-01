import {
  CognitoIdentityProvider,
  UserNotFoundException,
  InvalidParameterException,
} from '@aws-sdk/client-cognito-identity-provider';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import crypto from 'crypto';

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

const cognito = new CognitoIdentityProvider({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const calculateSecretHash = (username: string) => {
  const hmac = crypto.createHmac('sha256', process.env.COGNITO_CLIENT_SECRET || '');
  hmac.update(username + (process.env.COGNITO_CLIENT_ID || ''));
  return hmac.digest('base64');
};

export const signInOrRegister = async (
  username: string,
  password: string,
): Promise<string | undefined> => {
  try {
    const secretHash = calculateSecretHash(username);
    const authResponse = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID || '',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    });

    if (authResponse.AuthenticationResult) {
      const accessToken = authResponse.AuthenticationResult.AccessToken;
      const idToken = authResponse.AuthenticationResult.IdToken;

      const userDetails = await cognito.getUser({ AccessToken: accessToken });

      const email = userDetails.UserAttributes?.find(
        (attr) => attr.Name === 'email',
      )?.Value;

      if (!email) {
        throw new Error('Email not found in Cognito user attributes');
      }

      const userRepository = AppDataSource.getRepository(User);
      let user = await userRepository.findOne({ where: { email } });

      if (!user) {
        const name =
          userDetails.UserAttributes?.find((attr) => attr.Name === 'name')
            ?.Value || '';
        const role =
          userDetails.UserAttributes?.find(
            (attr) => attr.Name === 'custom:role',
          )?.Value || 'user';

        user = new User();
        user.email = email;
        user.name = name;
        user.role = role;
        await userRepository.save(user);
      }

      return idToken;
    }
  } catch (error) {
    if (error instanceof UserNotFoundException) {
      try {
        const secretHash = calculateSecretHash(username);
        await cognito.signUp({
          ClientId: process.env.COGNITO_CLIENT_ID || '',
          Username: username,
          Password: password,
          SecretHash: secretHash,
          UserAttributes: [{ Name: 'email', Value: username }],
        });

        // For simplicity, we are auto-confirming the user. 
        // In a real-world scenario, you would have a verification flow (e.g., email or SMS).
        await cognito.adminConfirmSignUp({
          UserPoolId: process.env.COGNITO_USER_POOL_ID || '',
          Username: username,
        });

        return signInOrRegister(username, password);
      } catch (error) {
        if (error instanceof InvalidParameterException) {
          throw new HttpError(400, error.message);
        }
        throw error;
      }
    }
    console.error(error);
    throw new Error('Authentication failed');
  }
};