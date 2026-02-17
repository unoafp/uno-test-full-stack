import { UserNotFoundError } from '../domain/errors';
import { UserRepository } from '../domain/repository';
import { User } from '../domain/user';
import { UserGetter } from './getter';

describe('UserGetter', () => {
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = {
      FindByRun: jest.fn(),
      Save: jest.fn(),
      Find: jest.fn(),
    };
  });

  it('should return user data if user exists', async () => {
    const user = new User('1', '12345678-9', 'John Doe');

    mockRepo.Find.mockResolvedValue(user);

    const getter = new UserGetter(mockRepo);

    const command = { id: '1' };

    const response = await getter.execute(command);

    expect(mockRepo.Find).toHaveBeenCalledWith(command.id);
    expect(response).toMatchObject({
      id: user.getId(),
      run: user.getRun(),
      name: user.getName(),
    });
  });

  it('should throw an error if user does not exist', async () => {
    mockRepo.Find.mockResolvedValue(null);

    const getter = new UserGetter(mockRepo);

    const command = { id: 'non-existent-id' };

    await expect(getter.execute(command)).rejects.toThrow(UserNotFoundError);

    expect(mockRepo.Find).toHaveBeenCalledWith(command.id);
  });
});
