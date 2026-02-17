import { UserRepository } from '../domain/repository';
import { User } from '../domain/user';
import { Command, Response } from './identifier.dto';

class UserIdentifier {
  constructor(private readonly repo: UserRepository) {}

  async execute({ run, name }: Command): Promise<Response> {
    const existingUser = await this.repo.FindByRun(run);

    if (existingUser != null) {
      return {
        id: existingUser.getId(),
        run: existingUser.getRun(),
        name: existingUser.getName(),
      };
    }

    const user = User.Create({ run, name });

    await this.repo.Save(user);

    return {
      id: user.getId(),
      run: user.getRun(),
      name: user.getName(),
    };
  }
}

export { UserIdentifier };
