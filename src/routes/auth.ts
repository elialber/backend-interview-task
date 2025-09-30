
import Router from 'koa-router';
import { signInOrRegister } from '../services/auth';

const router = new Router();

router.post('/auth', async (ctx) => {
  const { username, password } = ctx.request.body as { username?: string; password?: string };
  const token = await signInOrRegister(username, password);
  ctx.body = { token };
});

export default router;
