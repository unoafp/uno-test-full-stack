import { UserNotFoundError } from '../domain/errors';
import { UserRepository } from '../domain/repository';
import { Command } from './getter.dto';

export class UserGetter {
  constructor(private readonly repo: UserRepository) {}

  async execute({ id }: Command) {
    const user = await this.repo.Find(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return {
      id: user.getId(),
      run: user.getRun(),
      name: user.getName(),
    };
  }
}
