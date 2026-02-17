import { Module } from '@nestjs/common';
import { SESSION_STORE } from './session.token';
import { SessionStore } from './session.store';
import { SessionAuthGuard } from './session.guard';

@Module({
  providers: [
    {
      provide: SESSION_STORE,
      useClass: SessionStore,
    },
    SessionAuthGuard,
  ],
  exports: [SESSION_STORE, SessionAuthGuard],
})
export class SessionModule {}
