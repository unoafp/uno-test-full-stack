import { Module } from '@nestjs/common';
import { SESSION_STORE } from './session.token';
import { InmemSessionStore } from './session.store';
import { SessionAuthGuard } from './session.guard';

@Module({
  providers: [
    {
      provide: SESSION_STORE,
      useClass: InmemSessionStore,
    },
    SessionAuthGuard,
  ],
  exports: [SESSION_STORE, SessionAuthGuard],
})
export class SessionModule {}
