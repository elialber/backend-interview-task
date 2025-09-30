import { CognitoIdentityServiceProvider } from '@aws-sdk/client-cognito-identity-provider';

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
      // TODO: Get user details from Cognito
      // TODO: Check if user exists in local DB
      // TODO: If not, create user
      return authResponse.AuthenticationResult.IdToken;
    }
  } catch (error) {
    // TODO: Handle registration for users that don't exist
    console.error(error);
    throw new Error('Authentication failed');
  }
};