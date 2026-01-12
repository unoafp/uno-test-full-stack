import * as jwt from "jsonwebtoken";
import type {
  TokensResponse,
  LoginDto,
  TokenPayload,
  RegisterDto,
} from "./auth.types";
import apiClient, { guestClient } from "@/common/config/api/api-client.config";

class AuthService {
  private updateTokens(tokens: TokensResponse) {
    localStorage.setItem("accessToken", tokens.accessToken);
  }
  private getAccessToken(): string {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("missing tokken");
    return token;
  }
  private clearTokens() {
    localStorage.removeItem("accessToken");
  }

  private verifyTokenExpiration(token: string) {
    const payload = jwt.decode(token) as TokenPayload;
    if (payload.exp && typeof payload.exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        throw new Error("token expired");
      }
      return token;
    } else {
      throw new Error("token missing exp claim");
    }
  }

  async getTokenForRequest() {
    let accessToken = this.getAccessToken();

    try {
      this.verifyTokenExpiration(accessToken);
    } catch (error) {
      const err = error as Error;
      if (err.message === "token expired") {
        accessToken = await this.refreshTokens();
      }
    }
    return accessToken;
  }
  async refreshTokens(): Promise<string> {
    return await navigator.locks.request(
      "refresh",
      { ifAvailable: true },
      async (lock): Promise<string> => {
        if (!lock) {
          await navigator.locks.request("refresh", () => null);
          return this.getAccessToken();
        }
        const tokens = await guestClient
          .post<TokensResponse>("/auth/refresh")
          .then((res) => res.data);

        this.updateTokens(tokens);
        return tokens.accessToken;
      }
    );
  }
  async register(dto: RegisterDto) {
    return await guestClient
      .post("/auth/register", dto)
      .then((res) => res.data);
  }
  async login(credentials: LoginDto): Promise<TokensResponse> {
    const data = await guestClient
      .post<TokensResponse>("/auth/login", credentials)
      .then((res) => res.data);

    this.updateTokens(data);
    return data;
  }

  async logout() {
    const data = await apiClient
      .post<{ message: string }>("/auth/logout")
      .then((res) => res.data);
    this.clearTokens();
    return data;
  }

  async isAuthenticated() {
    try {
      const token = await this.getTokenForRequest();
      return !!token;
    } catch {
      return false;
    }
  }

  async getIdentity() {
    const token = this.getAccessToken();
    const payload = jwt.decode(token) as TokenPayload;
    return {
      name: payload.name,
    };
  }
}

const authService = new AuthService();

export default authService;
