
import Router from 'koa-router';
import { signInOrRegister } from '../services/auth';

const router = new Router();

router.post('/auth', async (ctx) => {
  const { username, password } = ctx.request.body as { username?: string; password?: string };

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { message: 'Username and password are required' };
    return;
  }

  const token = await signInOrRegister(username, password);
  ctx.body = { token };
});

export default router;
