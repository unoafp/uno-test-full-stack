import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repository';
import { User } from '../../../domain/user';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  FindByRun(id: string): Promise<User | null> {
    const user = this.users.get(id) || null;
    return Promise.resolve(user);
  }

  Save(user: User): Promise<void> {
    this.users.set(user.getId(), user);
    return Promise.resolve();
  }
}
