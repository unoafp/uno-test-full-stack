export type SessionStore = {
  create: (userId: string) => string;
  getUser: (sessionId: string) => string | undefined;
};

export class InmemSessionStore implements SessionStore {
  private sessions = new Map<string, string>();

  create(userId: string) {
    const id = crypto.randomUUID();
    this.sessions.set(id, userId);
    return id;
  }

  getUser(sessionId: string) {
    return this.sessions.get(sessionId);
  }
}
