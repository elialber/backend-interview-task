
import Router from 'koa-router';
import { authMiddleware } from '../middleware/auth';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const router = new Router();

router.put('/edit-account', authMiddleware, async (ctx) => {
  const { name, role } = ctx.request.body;
  const userFromToken = ctx.state.user;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email: userFromToken.email } });

  if (!user) {
    ctx.status = 404;
    ctx.body = { message: 'User not found' };
    return;
  }

  if (userFromToken['cognito:groups']?.includes('admin')) {
    if (name) user.name = name;
    if (role) user.role = role;
  } else {
    if (name) {
      user.name = name;
      user.isOnboarded = true;
    }
    if (role) {
      ctx.status = 403;
      ctx.body = { message: 'Only admins can change the role' };
      return;
    }
  }

  await userRepository.save(user);
  ctx.body = user;
});

export default router;
