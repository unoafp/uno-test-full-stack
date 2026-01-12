export interface LoginDto {
  rut: string;
}
export interface RegisterDto {
  rut: string;
  name: string;
}

export type TokensResponse = {
  accessToken: string;
};

export type TokenPayload = {
  sub: string;
  name: string;
  exp: number;
  iat: number;
};

export type GenericMessage = {
  message: string;
};
