export type SessionStore = {
  create: (id: string, name: string, run: string) => string;
  getUser: (
    sessionId: string,
  ) => { id: string; name: string; run: string } | undefined;
};

export class InmemSessionStore implements SessionStore {
  private sessions = new Map<
    string,
    { id: string; name: string; run: string }
  >();

  create(userId: string, name: string, run: string) {
    const id = crypto.randomUUID();
    this.sessions.set(id, { id: userId, name, run });
    return id;
  }

  getUser(sessionId: string) {
    return this.sessions.get(sessionId);
  }
}
