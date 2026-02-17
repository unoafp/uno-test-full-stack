import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { UserIdentifier } from './application/identifier';
import { UserAlreadyExistsError } from './domain/errors';

@Controller('auth')
export class AuthController {
  constructor(private readonly identifier: UserIdentifier) {}

  @Post('identify')
  async identify(
    // TODO : validate body with class-validator
    @Body() body: { name: string; run: string },
  ) {
    try {
      const user = await this.identifier.execute(body);
      return user;
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}
