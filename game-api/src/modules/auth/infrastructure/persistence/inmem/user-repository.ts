import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repository';
import { User } from '../../../domain/user';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private idToRun: Map<string, string> = new Map();
  private users: Map<string, User> = new Map();

  FindByRun(run: string): Promise<User | null> {
    const userId = this.idToRun.get(run);
    if (!userId) {
      return Promise.resolve(null);
    }
    const user = this.users.get(userId) || null;
    return Promise.resolve(user);
  }

  Find(id: string): Promise<User | null> {
    const user = this.users.get(id) || null;
    return Promise.resolve(user);
  }

  Save(user: User): Promise<void> {
    this.users.set(user.getId(), user);
    this.idToRun.set(user.getRun(), user.getId());
    return Promise.resolve();
  }
}
