import 'reflect-metadata';
import Koa from 'koa';
import { AppDataSource } from './data-source';

const app = new Koa();
const port = 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    app.use((ctx) => {
      ctx.body = 'Hello, World!';
    });

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) =>
    console.log('Error during Data Source initialization', error),
  );
