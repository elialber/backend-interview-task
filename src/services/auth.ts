import { CognitoIdentityServiceProvider, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const cognito = new CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

export const signInOrRegister = async (username, password) => {
  try {
    const authResponse = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID || '',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    if (authResponse.AuthenticationResult) {
      const accessToken = authResponse.AuthenticationResult.AccessToken;
      const idToken = authResponse.AuthenticationResult.IdToken;

      const userDetails = await cognito.getUser({ AccessToken: accessToken });

      const email = userDetails.UserAttributes.find(attr => attr.Name === 'email')?.Value;

      if (!email) {
        throw new Error('Email not found in Cognito user attributes');
      }

      const userRepository = AppDataSource.getRepository(User);
      let user = await userRepository.findOne({ where: { email } });

      if (!user) {
        const name = userDetails.UserAttributes.find(attr => attr.Name === 'name')?.Value || '';
        const role = userDetails.UserAttributes.find(attr => attr.Name === 'custom:role')?.Value || 'user';

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
      await cognito.signUp({
        ClientId: process.env.COGNITO_CLIENT_ID || '',
        Username: username,
        Password: password,
        UserAttributes: [{ Name: 'email', Value: username }],
      });

      // For simplicity, we are auto-confirming the user. 
      // In a real-world scenario, you would have a verification flow (e.g., email or SMS).
      await cognito.adminConfirmSignUp({
        UserPoolId: process.env.COGNITO_USER_POOL_ID || '',
        Username: username,
      });

      return signInOrRegister(username, password);
    }
    console.error(error);
    throw new Error('Authentication failed');
  }
};