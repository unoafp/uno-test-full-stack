import { UserRepository } from '../domain/repository';
import { User } from '../domain/user';
import { UserIdentifier } from './identifier';
import { Command } from './identifier.dto';

describe('UserIdentifier', () => {
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = {
      FindByRun: jest.fn(),
      Save: jest.fn(),
      Find: jest.fn(),
    };
  });

  it('should create a new user if run does not exist', async () => {
    mockRepo.FindByRun.mockResolvedValue(null);
    mockRepo.Save.mockResolvedValue(undefined);

    const identifier = new UserIdentifier(mockRepo);
    const command: Command = { run: '12345678-9', name: 'John Doe' };

    const response = await identifier.execute(command);

    expect(mockRepo.FindByRun).toHaveBeenCalledWith(command.run);
    expect(mockRepo.Save).toHaveBeenCalled();
    expect(response).toMatchObject({
      run: command.run,
      name: command.name,
    });
    expect(response.id).toBeDefined();
  });

  it('should return already exists', async () => {
    const existingUser: User = new User('1', '12345678-9', 'Existing User');

    mockRepo.FindByRun.mockResolvedValue(existingUser);

    const identifier = new UserIdentifier(mockRepo);
    const command: Command = { run: '12345678-9', name: 'John Doe' };

    const response = await identifier.execute(command);

    expect(mockRepo.FindByRun).toHaveBeenCalledWith(command.run);
    expect(mockRepo.Save).not.toHaveBeenCalled();
    expect(response).toMatchObject({
      run: '12345678-9',
      name: 'Existing User',
    });
    expect(response.id).toBeDefined();
  });
});
