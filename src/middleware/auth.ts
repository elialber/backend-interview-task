import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import fetch from 'node-fetch';

const pems: { [key: string]: string } = {};

const setUp = async () => {
  try {
    const response = await fetch(process.env.JWT_JWKS_URI || '');
    const jwks = await response.json();
    for (const key of jwks.keys) {
      pems[key.kid] = jwkToPem({ kty: key.kty, n: key.n, e: key.e });
    }
  } catch (error) {
    console.error('Error fetching JWKS', error);
  }
};

setUp();

export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { message: 'Authentication token is missing' };
    return;
  }

  try {
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    const kid = decodedToken.header.kid;
    if (!kid) {
      throw new Error('Invalid token');
    }
    const pem = pems[kid];
    if (!pem) {
      throw new Error('Invalid token');
    }

    jwt.verify(
      token,
      pem,
      { issuer: process.env.JWT_ISSUER },
      (err, payload) => {
        if (err) {
          throw err;
        }
        ctx.state.user = payload;
      },
    );

    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { message: 'Invalid token' };
  }
};
