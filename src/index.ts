import 'reflect-metadata';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { AppDataSource } from './data-source';
import router from './routes';

const app = new Koa();
const port = 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    app.use(bodyParser());
    app.use(router.routes()).use(router.allowedMethods());

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) =>
    console.log('Error during Data Source initialization', error),
  );

