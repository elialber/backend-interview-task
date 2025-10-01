import Router from 'koa-router';
import { authMiddleware } from '../middleware/auth';

const router = new Router();

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get the authenticated user's details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, (ctx) => {
  ctx.body = ctx.state.user;
});

export default router;
