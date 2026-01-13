import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapter/axios.adapter';

@Module({
  providers: [
    {
      provide: 'HttpAdapter',
      useClass: AxiosAdapter,
    },
  ],
  exports: ['HttpAdapter'],
})
export class CommonModule {}
