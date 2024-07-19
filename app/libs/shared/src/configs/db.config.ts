import { registerAs } from '@nestjs/config';
import { DAL_ENTITIES } from 'libs/dal/src';
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const databaseCredentials = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export const defaultDatabaseConfig = {
  type: 'postgres',
  logging: ['error'],
  synchronize: false,
  schema: 'public',
  entities: DAL_ENTITIES,
  migrationsTableName: 'migration',
  namingStrategy: new SnakeNamingStrategy(),
};

export const databaseConfig = registerAs('database', () => ({
  ...defaultDatabaseConfig,
  ...databaseCredentials,
}));

