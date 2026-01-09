import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import {
  hashRefreshToken,
  verifyRefreshTokenHash,
} from './utils/refresh-token.utils';
import { DRIZZLE_MAIN } from 'src/database/drizzle.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, DrizzleQueryError, eq } from 'drizzle-orm';
import { RegisterDto } from './dto/register.dto';
import { UserModel, usersTable } from './schema/user.schema';
import { refreshTokensTable } from './schema/resfresh-token.schema';
import { parseTimeToFutureDate } from './utils/time-parser.utils';
import { splitRut } from './utils/rut.utils';

type RefreshTokenPayload = { sub: string };

@Injectable()
export class AuthService {
  constructor(
    @Inject('ACCESS_JWT') private readonly accessTokenService: JwtService,
    @Inject('REFRESH_JWT') private readonly refreshTokenService: JwtService,
    @Inject(DRIZZLE_MAIN) private readonly db: NodePgDatabase,
  ) {}
  public async test() {
    const tables = await this.db.select().from(usersTable);

    return tables;
  }
  private signRefreshToken(user: UserModel) {
    return this.refreshTokenService.sign({ sub: user.id });
  }
  private signAccessToken(user: UserModel) {
    return this.accessTokenService.sign({
      sub: user.id,
      name: user.name,
    });
  }

  private async resolveUserFromRefreshToken(refreshToken: string) {
    const payload: RefreshTokenPayload =
      this.refreshTokenService.verify(refreshToken);

    const [stored] = await this.db
      .select({
        refreshToken: refreshTokensTable,
        user: usersTable,
      })
      .from(refreshTokensTable)
      .innerJoin(usersTable, eq(usersTable.id, refreshTokensTable.userId))
      .where(eq(refreshTokensTable.userId, payload.sub))
      .limit(1);

    if (!stored) {
      throw new UnauthorizedException(
        'No valid refresh token found or expired',
      );
    }
    const isMatch = verifyRefreshTokenHash(
      refreshToken,
      stored.refreshToken.tokenHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return stored.user;
  }

  async login(dto: LoginDto) {
    const { rut } = dto;
    const [body, dv] = splitRut(rut);
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(
        and(eq(usersTable.rutBody, Number(body)), eq(usersTable.rutDv, dv)),
      )
      .limit(1);

    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const accessToken = this.signAccessToken(user);
    const refreshToken = this.signRefreshToken(user);
    await this.updateUserRefreshToken(user, refreshToken);
    return { accessToken, refreshToken };
  }

  async rotateRefreshToken(refreshToken: string) {
    const user = await this.resolveUserFromRefreshToken(refreshToken);

    const accessToken = this.signAccessToken(user);
    const newRefreshToken = this.signRefreshToken(user);

    await this.updateUserRefreshToken(user, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async updateUserRefreshToken(user: UserModel, newRefreshToken: string) {
    const expiresAt = parseTimeToFutureDate('7d');
    const tokenHash = hashRefreshToken(newRefreshToken);

    const [updatedToken] = await this.db
      .insert(refreshTokensTable)
      .values({
        userId: user.id,
        tokenHash,
        expiresAt,
        revoked: false,
      })
      .onConflictDoUpdate({
        target: refreshTokensTable.userId,
        set: {
          tokenHash,
          expiresAt,
          revoked: false,
        },
      })
      .returning();

    return updatedToken;
  }

  async registerUser(dto: RegisterDto) {
    const { name, rut } = dto;
    const [body, dv] = splitRut(rut);
    const result = await this.db
      .transaction(async (tx) => {
        const [user] = await tx
          .insert(usersTable)
          .values({ name, rutBody: Number(body), rutDv: dv })
          .returning();
        return user;
      })
      .catch((error) => {
        if (error instanceof DrizzleQueryError) {
          const pgCode = (error.cause as any)?.code;

          if (pgCode === '23505') {
            throw new ConflictException('User already exist');
          }

          console.error('Error de base de datos:', error.cause);
          throw new InternalServerErrorException('Error de base de datos');
        }
        throw new InternalServerErrorException();
      });
    return result;
  }
  async logout(refreshToken: string) {
    await this.refreshTokenService.verify(refreshToken);
    const tokenHash = hashRefreshToken(refreshToken);
    await this.db
      .update(refreshTokensTable)
      .set({ revoked: true })
      .where(eq(refreshTokensTable.tokenHash, tokenHash))
      .catch((err) => {
        console.log(err);
      });

    return { message: 'Logged out successfully' };
  }
}
