import { User } from './user';

interface UserRepository {
  FindByRun: (run: string) => Promise<User | null>;
  Save: (user: User) => Promise<void>;
}

export type { UserRepository };
