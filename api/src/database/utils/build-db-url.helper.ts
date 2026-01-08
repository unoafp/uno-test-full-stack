import { ConfigService } from '@nestjs/config';

export const buildPostgresUrl = (config: ConfigService) => {
  const user = config.get<string>('POSTGRES_USER');
  const pass = config.get<string>('POSTGRES_PASSWORD');
  const host = config.get<string>('DB_HOST');
  const port = config.get<string>('DB_PORT');
  const db = config.get<string>('POSTGRES_DB');

  return `postgresql://${user}:${pass}@${host}:${port}/${db}`;
};
