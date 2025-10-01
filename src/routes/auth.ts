import Router from 'koa-router';
import { signInOrRegister, HttpError } from '../services/auth';

const router = new Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Authenticate user and get a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.post('/auth', async (ctx) => {
  try {
    const { username, password } = ctx.request.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      ctx.status = 400;
      ctx.body = { message: 'Username and password are required' };
      return;
    }

    const token = await signInOrRegister(username, password);
    ctx.body = { token };
  } catch (error) {
    if (error instanceof HttpError) {
      ctx.status = error.statusCode;
      ctx.body = { message: error.message };
    } else if (error instanceof Error) {
      ctx.status = 500;
      ctx.body = { message: error.message };
    } else {
      ctx.status = 500;
      ctx.body = { message: 'Internal Server Error' };
    }
  }
});

export default router;
