import 'reflect-metadata';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { AppDataSource } from './data-source';
import router from './routes';
import { koaSwagger } from 'koa2-swagger-ui';
import { swaggerSpec } from './swagger';

const app = new Koa();
const port = 3001;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    app.use(bodyParser());
    app.use(router.routes()).use(router.allowedMethods());
    app.use(
      koaSwagger({
        routePrefix: '/docs',
        swaggerOptions: { spec: swaggerSpec as any },
      }),
    );

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) =>
    console.log('Error during Data Source initialization', error),
  );
