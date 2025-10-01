import Router from 'koa-router';
import { authMiddleware } from '../middleware/auth';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const router = new Router();

router.get('/users', authMiddleware, async (ctx) => {
  const userFromToken = ctx.state.user;

  if (!userFromToken['cognito:groups']?.includes('admin')) {
    ctx.status = 403;
    ctx.body = { message: 'Only admins can access this route' };
    return;
  }

  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();
  ctx.body = users;
});

export default router;
