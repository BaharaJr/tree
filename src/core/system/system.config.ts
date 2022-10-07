import { existsSync, mkdirSync } from 'fs';
import { Person } from '../../modules/person/entities/person.entity';
const home = process.env.TREE_HOME || './artifacts';
export const FRONTEND = `${home}/app`;

export const system = () => {
  if (!existsSync(home)) {
    mkdirSync(home);
    mkdirSync(`${home}/dp`);
    mkdirSync(FRONTEND);
  }
  if (!existsSync(FRONTEND)) {
    mkdirSync(FRONTEND);
  }
  Person.createTree();
};

export const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  dropSchema: process.env.DROP_SCHEMA === 'TRUE' ? true : false,
  logging: false,
  synchronize: true,
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/modules/entities',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/subscriber',
  },
};
