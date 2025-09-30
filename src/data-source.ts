import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.NODE_ENV === 'test' ? 'localhost' : process.env.POSTGRES_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true, // Shouldn't be used in production
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
