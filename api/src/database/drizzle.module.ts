import { Module, Global, OnModuleDestroy, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_MAIN, PG_POOL_MAIN } from './drizzle.constants';
import { ConfigService } from '@nestjs/config';
import { buildPostgresUrl } from './utils/build-db-url.helper';

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL_MAIN,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: buildPostgresUrl(configService),
        });
        return pool;
      },
    },
    {
      provide: DRIZZLE_MAIN,
      inject: [PG_POOL_MAIN],
      useFactory: (pool: Pool) => {
        const db = drizzle(pool, {
          logger: true,
        });
        return db;
      },
    },
  ],
  exports: [DRIZZLE_MAIN, PG_POOL_MAIN],
})
export class DrizzleModule implements OnModuleDestroy {
  constructor(@Inject(PG_POOL_MAIN) private readonly mainPool: Pool) {}

  async onModuleDestroy() {
    if (this.mainPool) {
      await this.mainPool.end();
    }
  }
}
