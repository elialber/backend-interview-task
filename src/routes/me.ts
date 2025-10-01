import Router from 'koa-router';
import { authMiddleware } from '../middleware/auth';

const router = new Router();

router.get('/me', authMiddleware, (ctx) => {
  ctx.body = ctx.state.user;
});

export default router;
