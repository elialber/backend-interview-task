
import Router from 'koa-router';
import authRouter from './auth';
import meRouter from './me';
import editAccountRouter from './edit-account';
import usersRouter from './users';

const router = new Router();

router.use(authRouter.routes());
router.use(meRouter.routes());
router.use(editAccountRouter.routes());
router.use(usersRouter.routes());

export default router;
