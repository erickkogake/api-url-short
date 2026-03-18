import { envSchema } from './envs';

export default () => {
  const parsed = envSchema.parse(process.env);

  return {
    port: parseInt(parsed.PORT, 10),
    databaseUrl: parsed.DATABASE_URL,
  };
};