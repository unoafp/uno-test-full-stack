import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { IsAuthenticated } from './decorators/is-authenticated.decorator';
import { GetCurrentUser } from './decorators/current-user.decorator';
import { CurrentUser } from './strategies/jwt.strategy';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { RequestWithCookies } from './types/request.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly tokenCookieOptions: CookieOptions;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const isProduction =
      this.configService.get<string>('ENVIRONMENT') === 'production';

    this.tokenCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    };
  }

  @Post('register')
  async registerUser(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    res.cookie('refresh_token', refreshToken, this.tokenCookieOptions);

    return { accessToken };
  }

  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithCookies,
  ) {
    const cookieRefreshToken: string = req.cookies['refresh_token'];
    const { accessToken, refreshToken } =
      await this.authService.rotateRefreshToken(cookieRefreshToken);

    res.cookie('refresh_token', refreshToken, this.tokenCookieOptions);
    return { accessToken };
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithCookies,
  ) {
    const cookieRefreshToken: string = req.cookies['refresh_token'];

    const response = await this.authService.logout(cookieRefreshToken);
    res.clearCookie('refresh_token', this.tokenCookieOptions);

    return response;
  }
  @Get('test')
  @IsAuthenticated()
  test(@GetCurrentUser() user: CurrentUser) {
    return user;
  }
}
